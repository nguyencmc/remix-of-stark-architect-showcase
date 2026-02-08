import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALL_TABLES = [
  "achievements",
  "article_categories",
  "article_comments",
  "articles",
  "assignment_submissions",
  "audit_logs",
  "book_bookmarks",
  "book_categories",
  "book_chapters",
  "book_highlights",
  "book_notes",
  "books",
  "class_assignments",
  "class_courses",
  "class_members",
  "classes",
  "course_answers",
  "course_categories",
  "course_certificates",
  "course_lessons",
  "course_notes",
  "course_questions",
  "course_reviews",
  "course_sections",
  "course_test_attempts",
  "course_test_questions",
  "course_tests",
  "course_wishlists",
  "courses",
  "exam_attempts",
  "exam_categories",
  "exam_proctoring_logs",
  "exam_versions",
  "exams",
  "flashcard_decks",
  "flashcard_reviews",
  "flashcard_sets",
  "flashcards",
  "permissions",
  "podcast_categories",
  "podcasts",
  "practice_attempts",
  "practice_exam_sessions",
  "practice_questions",
  "profiles",
  "question_sets",
  "questions",
  "role_permissions",
  "study_group_members",
  "study_group_messages",
  "study_group_resources",
  "study_groups",
  "user_achievements",
  "user_book_progress",
  "user_course_enrollments",
  "user_flashcard_progress",
  "user_roles",
];

function escapeSQL(val: unknown): string {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "number") return String(val);
  if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
  if (Array.isArray(val)) {
    const items = val.map((v) => `'${String(v).replace(/'/g, "''")}'`).join(",");
    return `ARRAY[${items}]`;
  }
  if (typeof val === "object") {
    return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  }
  return `'${String(val).replace(/'/g, "''")}'`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let selectedTables = ALL_TABLES;

    if (req.method === "POST") {
      const body = await req.json();
      if (body.tables && Array.isArray(body.tables) && body.tables.length > 0) {
        selectedTables = body.tables.filter((t: string) => ALL_TABLES.includes(t));
      }
      if (body.action === "list_tables") {
        return new Response(JSON.stringify({ tables: ALL_TABLES }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const parts: string[] = [];
    parts.push("-- =============================================");
    parts.push("-- DATA EXPORT");
    parts.push(`-- Generated at: ${new Date().toISOString()}`);
    parts.push(`-- Tables: ${selectedTables.length}`);
    parts.push("-- =============================================");
    parts.push("");

    const errors: string[] = [];
    const tableCounts: Record<string, number> = {};

    for (const table of selectedTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select("*")
          .limit(10000);

        if (error) {
          errors.push(`Error fetching ${table}: ${error.message}`);
          parts.push(`-- ERROR: ${table}: ${error.message}`);
          tableCounts[table] = 0;
          continue;
        }

        const rows = data || [];
        tableCounts[table] = rows.length;

        parts.push(`-- -----------------------------------------------`);
        parts.push(`-- Table: ${table} (${rows.length} rows)`);
        parts.push(`-- -----------------------------------------------`);

        if (rows.length === 0) {
          parts.push(`-- (no data)`);
          parts.push("");
          continue;
        }

        const columns = Object.keys(rows[0]);
        const colList = columns.join(", ");

        // Generate INSERT statements in batches of 50
        for (let i = 0; i < rows.length; i += 50) {
          const batch = rows.slice(i, i + 50);
          parts.push(`INSERT INTO public.${table} (${colList}) VALUES`);

          const valueLines = batch.map((row) => {
            const vals = columns.map((col) => escapeSQL((row as Record<string, unknown>)[col]));
            return `  (${vals.join(", ")})`;
          });

          parts.push(valueLines.join(",\n") + "");
          parts.push(`ON CONFLICT (id) DO UPDATE SET`);
          
          const updateCols = columns
            .filter((c) => c !== "id")
            .map((c) => `  ${c} = EXCLUDED.${c}`);
          parts.push(updateCols.join(",\n") + ";");
          parts.push("");
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        errors.push(`Error fetching ${table}: ${errorMessage}`);
        parts.push(`-- ERROR: ${table}: ${errorMessage}`);
        tableCounts[table] = 0;
      }
    }

    // Summary at the end
    const totalRows = Object.values(tableCounts).reduce((a, b) => a + b, 0);
    parts.push("");
    parts.push("-- =============================================");
    parts.push(`-- SUMMARY: ${totalRows} total rows from ${selectedTables.length} tables`);
    if (errors.length > 0) {
      parts.push(`-- ERRORS: ${errors.length}`);
      for (const e of errors) parts.push(`--   ${e}`);
    }
    parts.push("-- =============================================");

    const sqlContent = parts.join("\n");
    console.log(`Data export complete: ${sqlContent.length} chars, ${totalRows} rows`);

    return new Response(sqlContent, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/sql",
        "Content-Disposition": `attachment; filename="data-export-${new Date().toISOString().split("T")[0]}.sql"`,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
