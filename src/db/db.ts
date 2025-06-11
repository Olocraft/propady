import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./types";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const API_KEY = process.env.API_KEY!;
let supabaseClient: SupabaseClient<Database>;

export const getClient = async () => {
  const cookieStore = await cookies();
  if (!supabaseClient) {
    supabaseClient = createServerClient(SUPABASE_URL, API_KEY, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    });
  }
  return supabaseClient;
};
