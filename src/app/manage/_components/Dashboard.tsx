'use client'

import { useState, useEffect } from "react";
import PropertyCard from "@/app/marketplace/_components/PropertyCard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Plus, Home, Settings } from "lucide-react";
import ListPropertyForm from "./ListPropertyForm";
import { useAuth } from "@/context/AuthContext";

import { fetchCurrentUserProperties } from "@/lib/actions/get-user-properties";
import { toast } from "sonner";

const Dashboard = () => {
  const [portfolioProperties, setPortfolioProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasProperties, setHasProperties] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserProperties = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const { success, properties, message } =
          await fetchCurrentUserProperties(user.id);

        if (!success) {
          toast.error(message);
        }
        setPortfolioProperties(properties!);
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast.error("There was an error loading your properties");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProperties();
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          {/* Sidebar - Mobile */}
          <div className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-propady-mint rounded-r-2xl p-4 space-y-8 z-20 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-black hover:bg-propady-mint-light"
            >
              <Plus size={24} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-black hover:bg-propady-mint-light"
            >
              <Home size={24} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-black hover:bg-propady-mint-light"
            >
              <Settings size={24} />
            </Button>
          </div>

          <div className="glass-morphism rounded-xl p-8 border border-white/10 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] rounded-full bg-propady-purple/10 blur-3xl" />
            <div className="absolute bottom-[-30px] left-[-30px] w-[150px] h-[150px] rounded-full bg-propady-mint/10 blur-3xl" />

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Your Portfolio
                  </h1>
                  <p className="text-white/70">Manage your property here</p>
                </div>

                <div className="flex gap-2 mt-4 md:mt-0">
                  <ListPropertyForm />
                  <Button className="bg-gradient-to-r from-propady-purple to-propady-purple-light text-white hover:opacity-90 transition-opacity">
                    Sell
                  </Button>
                  <Button className="bg-gradient-to-r from-propady-purple-light to-propady-mint text-white hover:opacity-90 transition-opacity">
                    Rent
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-20">
                  <div className="w-10 h-10 border-4 border-propady-purple border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : hasProperties ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {portfolioProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      {...property}
                      className="animate-enter"
                    />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center py-20"
                >
                  <h3 className="text-2xl font-semibold text-white/50 mb-4">
                    You have No Property available
                  </h3>
                  <Button
                    className="bg-propady-purple hover:bg-propady-purple-light text-white mt-4"
                    onClick={() => setHasProperties(true)}
                  >
                    Browse Properties
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
