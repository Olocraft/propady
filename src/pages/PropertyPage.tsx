
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import PropertyDetails from '@/components/PropertyDetails';

// Mock data
const propertiesDatabase = [
  {
    id: "property1",
    title: "Bungalow Terrace",
    price: "$130,025.00",
    mainImage: "/lovable-uploads/9cf1c88a-5f50-447e-a034-cb6515047de2.png",
    additionalImages: [
      "/lovable-uploads/6e09ce2d-feb2-4a17-b898-f69caf6eab4e.png",
      "/lovable-uploads/3eeac279-1354-4519-87b9-7561d83e730b.png",
      "/lovable-uploads/0ef9a1b3-5100-4a51-b446-be1f0172c4fd.png"
    ],
    location: "Lekki, Lagos",
    agency: "Horizon Estate, Ikoodu Lagos State",
    verified: true,
    features: [
      "Swimming Pool",
      "24 hr Power Supply",
      "4 bedrooms",
      "Big Kitchen",
      "More..."
    ]
  },
  {
    id: "property2",
    title: "Incomplete Tower",
    price: "$142,500.00",
    mainImage: "/lovable-uploads/6e09ce2d-feb2-4a17-b898-f69caf6eab4e.png",
    additionalImages: [
      "/lovable-uploads/9cf1c88a-5f50-447e-a034-cb6515047de2.png",
      "/lovable-uploads/3eeac279-1354-4519-87b9-7561d83e730b.png",
      "/lovable-uploads/0ef9a1b3-5100-4a51-b446-be1f0172c4fd.png"
    ],
    location: "Lekki, Lagos",
    agency: "Horizon Estate, Ikoodu Lagos State",
    verified: false,
    features: [
      "Under Construction",
      "Premium Location",
      "Investment Opportunity",
      "Expected Completion: Q4 2024",
      "More..."
    ]
  },
  {
    id: "property3",
    title: "Bungalow Terrace",
    price: "$150,000.00",
    mainImage: "/lovable-uploads/9cf1c88a-5f50-447e-a034-cb6515047de2.png",
    additionalImages: [
      "/lovable-uploads/6e09ce2d-feb2-4a17-b898-f69caf6eab4e.png",
      "/lovable-uploads/3eeac279-1354-4519-87b9-7561d83e730b.png",
      "/lovable-uploads/0ef9a1b3-5100-4a51-b446-be1f0172c4fd.png"
    ],
    location: "Lekki, Lagos",
    agency: "Horizon Estate, Ikoodu Lagos State",
    verified: true,
    features: [
      "Swimming Pool",
      "24 hr Power Supply",
      "5 bedrooms",
      "Smart Home System",
      "More..."
    ]
  }
];

const PropertyPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<typeof propertiesDatabase[0] | null>(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Find property by id
    const foundProperty = propertiesDatabase.find(p => p.id === id);
    if (foundProperty) {
      setProperty(foundProperty);
    }
  }, [id]);

  const handleBack = () => {
    navigate('/marketplace');
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28 container mx-auto px-4 text-center">
          <h1 className="text-2xl text-white">Property not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28">
        <PropertyDetails
          id={property.id}
          title={property.title}
          price={property.price}
          mainImage={property.mainImage}
          additionalImages={property.additionalImages}
          location={property.location}
          agency={property.agency}
          verified={property.verified}
          features={property.features}
          onBack={handleBack}
        />
      </div>
    </div>
  );
};

export default PropertyPage;
