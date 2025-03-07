
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import PropertyDetails from '@/components/PropertyDetails';
import CryptoPayment from '@/components/payment/CryptoPayment';
import { fetchPropertyById, mapPropertyToDisplay, Property } from '@/services/propertyService';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const PropertyPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchased, setPurchased] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    const getProperty = async () => {
      setLoading(true);
      if (!id) {
        toast({
          title: "Invalid property ID",
          description: "Could not load property details",
          variant: "destructive"
        });
        navigate('/marketplace');
        return;
      }

      try {
        const propertyData = await fetchPropertyById(id);
        if (propertyData) {
          setProperty(propertyData);
        } else {
          toast({
            title: "Property not found",
            description: "The requested property could not be found",
            variant: "destructive"
          });
          navigate('/marketplace');
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        toast({
          title: "Error loading property",
          description: "There was an error loading the property details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    getProperty();
  }, [id, navigate]);

  const handleBack = () => {
    navigate('/marketplace');
  };

  const handlePaymentSuccess = () => {
    setPurchased(true);
    toast({
      title: "Property purchased!",
      description: "Your investment has been recorded successfully",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28 container mx-auto px-4 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-propady-purple rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

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

  // Format property data for the PropertyDetails component
  const displayProperty = mapPropertyToDisplay(property);
  
  // Mock features based on property data
  const features = [
    property.bedrooms ? `${property.bedrooms} bedrooms` : "Spacious layout",
    property.bathrooms ? `${property.bathrooms} bathrooms` : "Modern bathrooms",
    property.area ? `${property.area} sqm area` : "Comfortable living space",
    property.blockchain_verified ? "Blockchain verified" : "Security system",
    "More..."
  ];

  // Check if the user is the owner of this property
  const isOwner = user && property.owner_id === user.id;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28">
        <PropertyDetails
          id={property.id}
          title={property.title}
          price={displayProperty.price}
          mainImage={property.images && property.images.length > 0 ? property.images[0] : "/lovable-uploads/9cf1c88a-5f50-447e-a034-cb6515047de2.png"}
          additionalImages={property.images && property.images.length > 1 ? property.images.slice(1) : [
            "/lovable-uploads/6e09ce2d-feb2-4a17-b898-f69caf6eab4e.png",
            "/lovable-uploads/3eeac279-1354-4519-87b9-7561d83e730b.png",
            "/lovable-uploads/0ef9a1b3-5100-4a51-b446-be1f0172c4fd.png"
          ]}
          location={property.location}
          agency="Propady Real Estate"
          verified={property.blockchain_verified || false}
          features={features}
          onBack={handleBack}
          actionButton={
            purchased ? (
              <div className="bg-propady-mint/20 text-propady-mint p-4 rounded-lg text-center">
                <p className="font-medium">Property Successfully Purchased!</p>
                <p className="text-sm mt-2">View in your portfolio</p>
              </div>
            ) : isOwner ? (
              <div className="bg-propady-purple/20 text-propady-purple p-4 rounded-lg text-center">
                <p className="font-medium">You own this property</p>
                <Button 
                  className="mt-2 bg-propady-purple hover:bg-propady-purple-light"
                  onClick={() => navigate('/manage')}
                >
                  Manage Property
                </Button>
              </div>
            ) : (
              <CryptoPayment 
                amount={property.price} 
                propertyId={property.id}
                onSuccess={handlePaymentSuccess}
              />
            )
          }
        />
      </div>
    </div>
  );
};

export default PropertyPage;
