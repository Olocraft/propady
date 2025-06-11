"use server";

import { mapPropertyToDisplay } from "./maps";
import { Property } from "./propertyService";
import { getClient } from "@/db/db";

interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  propertyType?: string;
  searchTerm?: string;
}

export const searchProperties = async (filters: SearchFilters) => {
  try {
    const supabase = await getClient();

    let query = supabase.from("properties").select("*");

    // Apply filters if provided
    if (filters.minPrice) {
      query = query.gte("price", filters.minPrice);
    }

    if (filters.maxPrice) {
      query = query.lte("price", filters.maxPrice);
    }

    if (filters.location) {
      query = query.ilike("location", `%${filters.location}%`);
    }

    if (filters.searchTerm) {
      query = query.or(
        `title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%,location.ilike.%${filters.searchTerm}%`
      );
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      throw error;
    }

    const properties = data as Property[];
    return { success: true, data: properties.map(mapPropertyToDisplay) };
  } catch (error) {
    console.error("Error searching properties:", error);

    return { success: false, message: error };
  }
};
