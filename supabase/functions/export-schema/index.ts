import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const dbUrl = Deno.env.get("SUPABASE_DB_URL")!;
    
    // Use postgres connection directly for schema export
    const { default: postgres } = await import("https://deno.land/x/postgresjs@v3.4.4/mod.js");
    const sql = postgres(dbUrl);

    const parts: string[] = [];
    parts.push("-- =============================================");
    parts.push("-- FULL SCHEMA EXPORT");
    parts.push(`-- Generated at: ${new Date().toISOString()}`);
    parts.push("-- =============================================\n");

    // 1. Export ENUM types
    console.log("Exporting enums...");
    const enums = await sql`
      SELECT t.typname AS enum_name,
             array_agg(e.enumlabel ORDER BY e.enumsortorder) AS enum_values
      FROM pg_type t
      JOIN pg_enum e ON t.oid = e.enumtypid
      JOIN pg_namespace n ON t.typnamespace = n.oid
      WHERE n.nspname = 'public'
      GROUP BY t.typname
      ORDER BY t.typname
    `;
    if (enums.length > 0) {
      parts.push("-- =============================================");
      parts.push("-- ENUM TYPES");
      parts.push("-- =============================================\n");
      for (const en of enums) {
        const vals = en.enum_values.map((v: string) => `'${v}'`).join(", ");
        parts.push(`CREATE TYPE public.${en.enum_name} AS ENUM (${vals});\n`);
      }
    }

    // 2. Export tables with columns, defaults, constraints
    console.log("Exporting tables...");
    const tables = await sql`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;

    parts.push("-- =============================================");
    parts.push("-- TABLES");
    parts.push("-- =============================================\n");

    for (const t of tables) {
      const tableName = t.table_name;
      
      const columns = await sql`
        SELECT column_name, data_type, udt_name, is_nullable, column_default,
               character_maximum_length, numeric_precision, numeric_scale
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = ${tableName}
        ORDER BY ordinal_position
      `;

      parts.push(`-- Table: ${tableName}`);
      parts.push(`CREATE TABLE IF NOT EXISTS public.${tableName} (`);

      const colDefs: string[] = [];
      for (const col of columns) {
        let typeName = col.data_type;
        if (typeName === 'USER-DEFINED') {
          typeName = `public.${col.udt_name}`;
        } else if (typeName === 'ARRAY') {
          typeName = `${col.udt_name.replace(/^_/, '')}[]`;
        } else if (typeName === 'character varying') {
          typeName = col.character_maximum_length ? `varchar(${col.character_maximum_length})` : 'text';
        } else if (typeName === 'timestamp with time zone') {
          typeName = 'timestamptz';
        } else if (typeName === 'timestamp without time zone') {
          typeName = 'timestamp';
        }

        let def = `  ${col.column_name} ${typeName}`;
        if (col.is_nullable === 'NO') def += ' NOT NULL';
        if (col.column_default !== null) def += ` DEFAULT ${col.column_default}`;
        colDefs.push(def);
      }

      // Primary keys
      const pks = await sql`
        SELECT kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
        WHERE tc.table_schema = 'public' AND tc.table_name = ${tableName}
          AND tc.constraint_type = 'PRIMARY KEY'
        ORDER BY kcu.ordinal_position
      `;
      if (pks.length > 0) {
        const pkCols = pks.map((p: any) => p.column_name).join(", ");
        colDefs.push(`  PRIMARY KEY (${pkCols})`);
      }

      // Unique constraints
      const uqs = await sql`
        SELECT tc.constraint_name, array_agg(kcu.column_name ORDER BY kcu.ordinal_position) AS cols
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
        WHERE tc.table_schema = 'public' AND tc.table_name = ${tableName}
          AND tc.constraint_type = 'UNIQUE'
        GROUP BY tc.constraint_name
      `;
      for (const uq of uqs) {
        colDefs.push(`  CONSTRAINT ${uq.constraint_name} UNIQUE (${uq.cols.join(", ")})`);
      }

      parts.push(colDefs.join(",\n"));
      parts.push(`);\n`);

      // Foreign keys
      const fks = await sql`
        SELECT
          tc.constraint_name,
          kcu.column_name,
          ccu.table_schema AS foreign_table_schema,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name,
          rc.delete_rule, rc.update_rule
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage ccu
          ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
        JOIN information_schema.referential_constraints rc
          ON rc.constraint_name = tc.constraint_name AND rc.constraint_schema = tc.table_schema
        WHERE tc.table_schema = 'public' AND tc.table_name = ${tableName}
          AND tc.constraint_type = 'FOREIGN KEY'
      `;
      for (const fk of fks) {
        let stmt = `ALTER TABLE public.${tableName} ADD CONSTRAINT ${fk.constraint_name} FOREIGN KEY (${fk.column_name}) REFERENCES ${fk.foreign_table_schema}.${fk.foreign_table_name}(${fk.foreign_column_name})`;
        if (fk.delete_rule && fk.delete_rule !== 'NO ACTION') stmt += ` ON DELETE ${fk.delete_rule}`;
        if (fk.update_rule && fk.update_rule !== 'NO ACTION') stmt += ` ON UPDATE ${fk.update_rule}`;
        parts.push(`${stmt};`);
      }

      parts.push("");
    }

    // 3. RLS enable + policies
    console.log("Exporting RLS policies...");
    parts.push("-- =============================================");
    parts.push("-- ROW LEVEL SECURITY");
    parts.push("-- =============================================\n");

    const rlsTables = await sql`
      SELECT relname FROM pg_class
      JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
      WHERE nspname = 'public' AND relkind = 'r' AND relrowsecurity = true
      ORDER BY relname
    `;
    for (const t of rlsTables) {
      parts.push(`ALTER TABLE public.${t.relname} ENABLE ROW LEVEL SECURITY;`);
    }
    parts.push("");

    const policies = await sql`
      SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
      FROM pg_policies WHERE schemaname = 'public'
      ORDER BY tablename, policyname
    `;
    for (const p of policies) {
      const permissive = p.permissive === 'PERMISSIVE' ? 'PERMISSIVE' : 'RESTRICTIVE';
      let stmt = `CREATE POLICY "${p.policyname}" ON public.${p.tablename} AS ${permissive}`;
      stmt += ` FOR ${p.cmd}`;
      if (p.roles && p.roles.length > 0) stmt += ` TO ${p.roles.join(", ")}`;
      if (p.qual) stmt += ` USING (${p.qual})`;
      if (p.with_check) stmt += ` WITH CHECK (${p.with_check})`;
      parts.push(`${stmt};`);
    }
    parts.push("");

    // 4. Functions
    console.log("Exporting functions...");
    parts.push("-- =============================================");
    parts.push("-- FUNCTIONS");
    parts.push("-- =============================================\n");

    const functions = await sql`
      SELECT pg_get_functiondef(p.oid) AS funcdef
      FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE n.nspname = 'public'
      ORDER BY p.proname
    `;
    for (const f of functions) {
      parts.push(`${f.funcdef};\n`);
    }

    // 5. Triggers
    console.log("Exporting triggers...");
    parts.push("-- =============================================");
    parts.push("-- TRIGGERS");
    parts.push("-- =============================================\n");

    const triggers = await sql`
      SELECT pg_get_triggerdef(t.oid) AS triggerdef
      FROM pg_trigger t
      JOIN pg_class c ON t.tgrelid = c.oid
      JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE n.nspname = 'public' AND NOT t.tgisinternal
      ORDER BY c.relname, t.tgname
    `;
    for (const tr of triggers) {
      parts.push(`${tr.triggerdef};\n`);
    }

    // 6. Indexes
    console.log("Exporting indexes...");
    parts.push("-- =============================================");
    parts.push("-- INDEXES");
    parts.push("-- =============================================\n");

    const indexes = await sql`
      SELECT indexdef FROM pg_indexes
      WHERE schemaname = 'public'
        AND indexname NOT LIKE '%_pkey'
        AND indexname NOT LIKE '%_unique%'
      ORDER BY tablename, indexname
    `;
    for (const idx of indexes) {
      parts.push(`${idx.indexdef};\n`);
    }

    // 7. Storage buckets
    console.log("Exporting storage buckets...");
    parts.push("-- =============================================");
    parts.push("-- STORAGE BUCKETS");
    parts.push("-- =============================================\n");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: buckets } = await supabase.storage.listBuckets();
    if (buckets) {
      for (const b of buckets) {
        parts.push(`INSERT INTO storage.buckets (id, name, public) VALUES ('${b.id}', '${b.name}', ${b.public}) ON CONFLICT (id) DO NOTHING;`);
      }
      parts.push("");
    }

    // Storage policies
    const storagePolicies = await sql`
      SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
      FROM pg_policies WHERE schemaname = 'storage'
      ORDER BY tablename, policyname
    `;
    if (storagePolicies.length > 0) {
      parts.push("-- Storage RLS policies");
      for (const p of storagePolicies) {
        const permissive = p.permissive === 'PERMISSIVE' ? 'PERMISSIVE' : 'RESTRICTIVE';
        let stmt = `CREATE POLICY "${p.policyname}" ON storage.${p.tablename} AS ${permissive}`;
        stmt += ` FOR ${p.cmd}`;
        if (p.roles && p.roles.length > 0) stmt += ` TO ${p.roles.join(", ")}`;
        if (p.qual) stmt += ` USING (${p.qual})`;
        if (p.with_check) stmt += ` WITH CHECK (${p.with_check})`;
        parts.push(`${stmt};`);
      }
      parts.push("");
    }

    // 8. Realtime publications
    console.log("Exporting realtime config...");
    const publications = await sql`
      SELECT tablename FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
      ORDER BY tablename
    `;
    if (publications.length > 0) {
      parts.push("-- =============================================");
      parts.push("-- REALTIME PUBLICATIONS");
      parts.push("-- =============================================\n");
      for (const pub of publications) {
        parts.push(`ALTER PUBLICATION supabase_realtime ADD TABLE public.${pub.tablename};`);
      }
      parts.push("");
    }

    await sql.end();

    const fullSql = parts.join("\n");
    console.log(`Schema export complete: ${fullSql.length} characters`);

    return new Response(fullSql, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/sql",
        "Content-Disposition": `attachment; filename="schema-export-${new Date().toISOString().split('T')[0]}.sql"`,
      },
    });
  } catch (error: unknown) {
    console.error("Export error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
