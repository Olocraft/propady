'use server'

import { getClient } from "@/db/db";

export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  description?: string;
  images?: string[];
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  owner_id: string;
  blockchain_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface PropertyDisplay {
  id: string;
  title: string;
  price: string;
  image: string;
  location: string;
  agency: string;
  verified: boolean;
  roi: string;
  annualReturn: string;
  supportedChains?: string[];
}

export const fetchAllProperties = async (): Promise<{
  success: boolean;
  data?: Property[];
  message?: unknown;
}> => {
  try {
        const supabase = await getClient();
    
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return { success: true, data: data as Property[] || [] };
  } catch (error) {
    console.error("Error fetching properties:", error);
    return { success: false, message: error, data: [] };
  }
};

export const fetchPropertyById = async (id: string) => {
  try {
        const supabase = await getClient();

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data: data as Property };
  } catch (error) {
    console.error("Error fetching property:", error);

    return { success: false, message: error };
  }
};

