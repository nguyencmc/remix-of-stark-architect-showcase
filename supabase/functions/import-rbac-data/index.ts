import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.91.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const importData = body.data || body;

    if (!importData || !importData.tables) {
      return new Response(
        JSON.stringify({ error: "Invalid import data format. Expected { tables: { tableName: [...rows] } }" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results: Record<string, { inserted: number; errors: string[] }> = {};

    // Import each table using upsert
    for (const [tableName, rows] of Object.entries(importData.tables)) {
      if (!Array.isArray(rows) || rows.length === 0) continue;

      results[tableName] = { inserted: 0, errors: [] };

      // Batch upsert in chunks of 100
      const chunkSize = 100;
      for (let i = 0; i < rows.length; i += chunkSize) {
        const chunk = rows.slice(i, i + chunkSize);
        try {
          const { error } = await supabase
            .from(tableName)
            .upsert(chunk as Record<string, unknown>[], { onConflict: "id", ignoreDuplicates: false });

          if (error) {
            results[tableName].errors.push(`Chunk ${Math.floor(i / chunkSize) + 1}: ${error.message}`);
          } else {
            results[tableName].inserted += chunk.length;
          }
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          results[tableName].errors.push(`Chunk ${Math.floor(i / chunkSize) + 1}: ${msg}`);
        }
      }
    }

    const summary: Record<string, number> = {};
    const allErrors: string[] = [];
    for (const [table, result] of Object.entries(results)) {
      summary[table] = result.inserted;
      if (result.errors.length > 0) {
        allErrors.push(...result.errors.map(e => `${table}: ${e}`));
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        results,
        summary,
        total_imported: Object.values(summary).reduce((a, b) => a + b, 0),
        errors: allErrors.length > 0 ? allErrors : undefined,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Import error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
