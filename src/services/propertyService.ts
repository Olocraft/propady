
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
}

export const fetchAllProperties = async (): Promise<Property[]> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching properties:', error);
    toast({
      title: "Error fetching properties",
      description: "There was an error loading the properties. Please try again.",
      variant: "destructive"
    });
    return [];
  }
};

export const fetchPropertyById = async (id: string): Promise<Property | null> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching property:', error);
    toast({
      title: "Error fetching property",
      description: "There was an error loading the property details. Please try again.",
      variant: "destructive"
    });
    return null;
  }
};

export const fetchUserProperties = async (userId: string): Promise<Property[]> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching user properties:', error);
    toast({
      title: "Error fetching your properties",
      description: "There was an error loading your properties. Please try again.",
      variant: "destructive"
    });
    return [];
  }
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

export const mapPropertyToDisplay = (property: Property): PropertyDisplay => {
  // Calculate ROI and annual return (mock values for now)
  const roi = "12.08%";
  const annualReturn = "8.5%";

  // Mock supported chains based on property price
  const supportedChains = [];
  if (property.price > 100000) supportedChains.push('ethereum');
  if (property.price > 50000) supportedChains.push('solana');
  if (property.price > 30000) supportedChains.push('polygon');
  if (property.price > 20000) supportedChains.push('binance');

  // Determine property type based on features
  const propertyType = property.bedrooms ? 
    'Residential' : 
    property.area && property.area > 5000 ? 
    'Commercial' : 'Land';

  return {
    id: property.id,
    title: property.title,
    price: formatPrice(property.price),
    image: property.images && property.images.length > 0 
      ? property.images[0] 
      : "/lovable-uploads/9cf1c88a-5f50-447e-a034-cb6515047de2.png",
    location: property.location,
    agency: "Propady Real Estate",
    verified: property.blockchain_verified || false,
    roi,
    annualReturn,
    supportedChains,
    propertyType,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.area
  };
};
