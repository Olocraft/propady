import CryptoPayment from "@/app/(index)/_components/payment/CryptoPayment";
import CashPayment from "@/app/marketplace/_components/payment/CashPayment";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { Property } from "@/lib/services/propertyService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import PropertyDetails from "./PropertyDetails";
import { mapPropertyToDisplay } from "@/lib/services/maps";

type Data = {
  property: Property | null;
};

export function DynamicPage({ property }: Data) {
  const [purchased, setPurchased] = useState(false);

  const { user } = useAuth();

  const router = useRouter();

  const handleBack = () => {
    router.push("/marketplace");
  };

  const handlePaymentSuccess = () => {
    setPurchased(true);
    toast.success("Your investment has been recorded successfully");
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-28 container mx-auto px-4 text-center">
          <h1 className="text-2xl text-white">Property not found</h1>
        </div>
      </div>
    );
  }

  const displayProperty = mapPropertyToDisplay(property);

  const features = [
    property.bedrooms ? `${property.bedrooms} bedrooms` : "Spacious layout",
    property.bathrooms ? `${property.bathrooms} bathrooms` : "Modern bathrooms",
    property.area ? `${property.area} sqm area` : "Comfortable living space",
    property.blockchain_verified ? "Blockchain verified" : "Security system",
    "More...",
  ];

  const isOwner = user && property.owner_id === user.id;

  const paymentOptions = (
    <div className="space-y-4">
      <Tabs defaultValue="crypto" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4 bg-white/5">
          <TabsTrigger
            value="crypto"
            className="data-[state=active]:bg-propady-mint data-[state=active]:text-black"
          >
            Crypto
          </TabsTrigger>
          <TabsTrigger
            value="cash"
            className="data-[state=active]:bg-white data-[state=active]:text-black"
          >
            Cash
          </TabsTrigger>
        </TabsList>
        <TabsContent value="crypto">
          <CryptoPayment
            amount={property.price}
            propertyId={property.id}
            onSuccess={handlePaymentSuccess}
          />
        </TabsContent>
        <TabsContent value="cash">
          <CashPayment
            amount={property.price}
            propertyId={property.id}
            onSuccess={handlePaymentSuccess}
          />
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-28">
        <PropertyDetails
          id={property.id}
          title={property.title}
          price={displayProperty.price}
          mainImage={
            property.images && property.images.length > 0
              ? property.images[0]
              : "/lovable-uploads/9cf1c88a-5f50-447e-a034-cb6515047de2.png"
          }
          additionalImages={
            property.images && property.images.length > 1
              ? property.images.slice(1)
              : [
                  "/lovable-uploads/6e09ce2d-feb2-4a17-b898-f69caf6eab4e.png",
                  "/lovable-uploads/3eeac279-1354-4519-87b9-7561d83e730b.png",
                  "/lovable-uploads/0ef9a1b3-5100-4a51-b446-be1f0172c4fd.png",
                ]
          }
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
                  onClick={() => router.push("/manage")}
                >
                  Manage Property
                </Button>
              </div>
            ) : (
              paymentOptions
            )
          }
        />
      </div>
    </div>
  );
}
