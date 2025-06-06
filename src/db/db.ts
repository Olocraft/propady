
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./types";

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const API_KEY = process.env.API_KEY || "";

let supabaseClient: SupabaseClient<Database>;

const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, API_KEY);
  }
  return supabaseClient;
};

export const supabase = getSupabaseClient();
