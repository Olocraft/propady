"use server";

import { supabase } from "@/db/db";

export async function uploadImage(
  propertyId: string,
  fileName: string,
  file: File
) {
  const { error: uploadError } = await supabase.storage
    .from("properties")
    .upload(`${propertyId}/${fileName}`, file);

  if (uploadError) {
    console.error("Error uploading image:", uploadError);
    return { success: false, message: uploadError.message };
  }
  return { success: true, message: "Uploaded" };
}

export async function getPublicUrl(propertyId: string, fileName: string) {
  const { data: publicUrlData } = supabase.storage
    .from("properties")
    .getPublicUrl(`${propertyId}/${fileName}`);

  if (publicUrlData?.publicUrl) {
    return { data: publicUrlData.publicUrl, success: true };
  }

  return { success: false, data: "" };
}

export async function updatePropertyWithImgUrls(
  imageUrls: string[],
  propertyId: string
) {
  return await supabase
    .from("properties")
    .update({ images: imageUrls })
    .eq("id", propertyId);
}

export async function insertProperty(
  bedrooms: string,
  bathrooms: string,
  price: string,
  title: string,
  description: string,
  propertyType: string,
  userId: string,
  location: string,
  area?: string
) {
  const { data, error } = await supabase
    .from("properties")
    .insert({
      title,
      price: parseFloat(price),
      location,
      description,
      bedrooms: bedrooms ? parseInt(bedrooms) : null,
      bathrooms: bathrooms ? parseInt(bathrooms) : null,
      area: area ? parseFloat(area) : null,
      property_type: propertyType,
      owner_id: userId,
      images: [],
    })
    .select();

  return { data, error };
}
