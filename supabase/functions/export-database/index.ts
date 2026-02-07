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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let selectedTables = ALL_TABLES;

    // Support POST with selected tables, or GET for all
    if (req.method === "POST") {
      const body = await req.json();
      if (body.tables && Array.isArray(body.tables) && body.tables.length > 0) {
        // Only allow valid table names
        selectedTables = body.tables.filter((t: string) => ALL_TABLES.includes(t));
      }
      if (body.action === "list_tables") {
        return new Response(JSON.stringify({ tables: ALL_TABLES }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const exportData: Record<string, unknown[]> = {};
    const errors: string[] = [];

    for (const table of selectedTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select("*")
          .limit(10000);

        if (error) {
          errors.push(`Error fetching ${table}: ${error.message}`);
          exportData[table] = [];
        } else {
          exportData[table] = data || [];
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        errors.push(`Error fetching ${table}: ${errorMessage}`);
        exportData[table] = [];
      }
    }

    const result = {
      exported_at: new Date().toISOString(),
      tables: exportData,
      table_counts: Object.fromEntries(
        Object.entries(exportData).map(([table, data]) => [table, data.length])
      ),
      errors: errors.length > 0 ? errors : undefined,
    };

    return new Response(JSON.stringify(result, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
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
