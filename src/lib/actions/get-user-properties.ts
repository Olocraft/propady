"use server";

import { supabase } from "@/db/db";
import { Property } from "../services/propertyService";
import { mapPropertyToDisplay } from "../services/maps";

export const fetchCurrentUserProperties = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (data && data.length > 0) {
      const formattedProperties = (data as Property[]).map(
        (property: Property) => mapPropertyToDisplay(property)
      );
      return {
        success: true,
        properties: formattedProperties,
      };
    }
    return {
      success: true,
      properties: [],
    };
  } catch (error) {
    console.error("Error fetching properties:", error);
    return {
      success: false,
      message: "There was an error loading your properties",
    };
  }
};
