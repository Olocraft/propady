import { Property, PropertyDisplay } from "./propertyService";

 const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const mapPropertyToDisplay = (property: Property): PropertyDisplay => {
  // Calculate ROI and annual return (mock values for now)
  const roi = "12.08%";
  const annualReturn = "8.5%";

  // Mock supported chains based on property price
  const supportedChains = [];
  if (property.price > 100000) supportedChains.push("ethereum");
  if (property.price > 50000) supportedChains.push("solana");
  if (property.price > 30000) supportedChains.push("polygon");
  if (property.price > 20000) supportedChains.push("binance");

  return {
    id: property.id,
    title: property.title,
    price: formatPrice(property.price),
    image:
      property.images && property.images.length > 0
        ? property.images[0]
        : "/lovable-uploads/9cf1c88a-5f50-447e-a034-cb6515047de2.png",
    location: property.location,
    agency: "Propady Real Estate",
    verified: property.blockchain_verified || false,
    roi,
    annualReturn,
    supportedChains,
  };
};
