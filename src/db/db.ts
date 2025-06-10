import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./types";

const SUPABASE_URL =
  process.env.SUPABASE_URL || "https://gtnedsazxztbawbdypvk.supabase.co";
const API_KEY =
  process.env.API_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0bmVkc2F6eHp0YmF3YmR5cHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMDA3NjIsImV4cCI6MjA2NDc3Njc2Mn0.3Yhu4t9wvb6vC74pN430XO8vZJ9LNS4P8zGm0mF5Fp0";

let supabaseClient: SupabaseClient<Database>;

const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, API_KEY);
  }
  return supabaseClient;
};

export const supabase = getSupabaseClient();
