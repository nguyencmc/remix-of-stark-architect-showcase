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

    const { data: importData } = await req.json();

    if (!importData || !importData.tables) {
      return new Response(
        JSON.stringify({ error: "Invalid import data format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results: Record<string, { inserted: number; errors: string[] }> = {};

    // 1. Import permissions first (they are referenced by role_permissions)
    if (importData.tables.permissions && importData.tables.permissions.length > 0) {
      results.permissions = { inserted: 0, errors: [] };
      
      for (const permission of importData.tables.permissions) {
        const { error } = await supabase
          .from("permissions")
          .upsert(permission, { onConflict: "id" });
        
        if (error) {
          results.permissions.errors.push(`Permission ${permission.name}: ${error.message}`);
        } else {
          results.permissions.inserted++;
        }
      }
    }

    // 2. Import role_permissions
    if (importData.tables.role_permissions && importData.tables.role_permissions.length > 0) {
      results.role_permissions = { inserted: 0, errors: [] };
      
      for (const rp of importData.tables.role_permissions) {
        const { error } = await supabase
          .from("role_permissions")
          .upsert(rp, { onConflict: "id" });
        
        if (error) {
          results.role_permissions.errors.push(`Role permission ${rp.id}: ${error.message}`);
        } else {
          results.role_permissions.inserted++;
        }
      }
    }

    // 3. Import user_roles (only if users exist in the system)
    if (importData.tables.user_roles && importData.tables.user_roles.length > 0) {
      results.user_roles = { inserted: 0, errors: [] };
      
      for (const ur of importData.tables.user_roles) {
        const { error } = await supabase
          .from("user_roles")
          .upsert(ur, { onConflict: "id" });
        
        if (error) {
          results.user_roles.errors.push(`User role ${ur.id}: ${error.message}`);
        } else {
          results.user_roles.inserted++;
        }
      }
    }

    // 4. Import user_achievements
    if (importData.tables.user_achievements && importData.tables.user_achievements.length > 0) {
      results.user_achievements = { inserted: 0, errors: [] };
      
      for (const ua of importData.tables.user_achievements) {
        const { error } = await supabase
          .from("user_achievements")
          .upsert(ua, { onConflict: "id" });
        
        if (error) {
          results.user_achievements.errors.push(`User achievement ${ua.id}: ${error.message}`);
        } else {
          results.user_achievements.inserted++;
        }
      }
    }

    // 5. Import/update profiles
    if (importData.tables.profiles && importData.tables.profiles.length > 0) {
      results.profiles = { inserted: 0, errors: [] };
      
      for (const profile of importData.tables.profiles) {
        const { error } = await supabase
          .from("profiles")
          .upsert(profile, { onConflict: "id" });
        
        if (error) {
          results.profiles.errors.push(`Profile ${profile.email}: ${error.message}`);
        } else {
          results.profiles.inserted++;
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        results,
        summary: {
          permissions: results.permissions?.inserted || 0,
          role_permissions: results.role_permissions?.inserted || 0,
          user_roles: results.user_roles?.inserted || 0,
          user_achievements: results.user_achievements?.inserted || 0,
          profiles: results.profiles?.inserted || 0,
        }
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
