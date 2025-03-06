
import { supabase } from "@/integrations/supabase/client";

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images?: string[];
  owner_id: string;
  blockchain_verified: boolean;
  created_at: string;
  updated_at: string;
}

export async function getProperties(filters?: {
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  verified?: boolean;
}) {
  let query = supabase.from('properties').select('*');
  
  if (filters) {
    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }
    
    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }
    
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    
    if (filters.bedrooms !== undefined) {
      query = query.gte('bedrooms', filters.bedrooms);
    }
    
    if (filters.bathrooms !== undefined) {
      query = query.gte('bathrooms', filters.bathrooms);
    }
    
    if (filters.verified !== undefined) {
      query = query.eq('blockchain_verified', filters.verified);
    }
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
  
  return data as Property[];
}

export async function getPropertyById(id: string) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching property:', error);
    throw error;
  }
  
  return data as Property;
}

export async function createProperty(property: Omit<Property, 'id' | 'created_at' | 'updated_at' | 'owner_id'>) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    console.error('Error getting user:', userError);
    throw userError;
  }
  
  const { data, error } = await supabase
    .from('properties')
    .insert([
      {
        ...property,
        owner_id: userData.user.id,
      },
    ])
    .select();
  
  if (error) {
    console.error('Error creating property:', error);
    throw error;
  }
  
  return data[0] as Property;
}

export async function updateProperty(id: string, property: Partial<Omit<Property, 'id' | 'created_at' | 'updated_at' | 'owner_id'>>) {
  const { data, error } = await supabase
    .from('properties')
    .update({
      ...property,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating property:', error);
    throw error;
  }
  
  return data[0] as Property;
}

export async function deleteProperty(id: string) {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
  
  return true;
}
