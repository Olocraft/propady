"use server";

import { redirect } from "next/navigation";
import { fetchPropertyById } from "../services/propertyService";

export const getProperty = async (id: string) => {
  try {
    const propertyData = await fetchPropertyById(id);
    if (propertyData.success) {
      return { success: true, property: propertyData.data! };
    } else {
      redirect("/marketplace");
    }
  } catch (error) {
    console.error("Error fetching property:", error);

    return {
      success: false,
      message: "There was an error loading the property details",
    };
  }
};
