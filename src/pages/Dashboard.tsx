
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import PropertyCard from '@/components/ui/PropertyCard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Plus, Home, Settings } from 'lucide-react';
import ListPropertyForm from '@/components/ListPropertyForm';

// Mock portfolio properties
const portfolioProperties = [
  {
    id: "portfolio1",
    title: "Incomplete Tower",
    price: "$130k",
    image: "/lovable-uploads/6e09ce2d-feb2-4a17-b898-f69caf6eab4e.png",
    location: "Lekki, Lagos",
    agency: "",
    verified: false,
    roi: "12.08%",
    annualReturn: "12.08%",
    supportedChains: ["ethereum", "solana", "polygon", "binance"]
  },
  {
    id: "portfolio2",
    title: "Incomplete Tower",
    price: "$130k",
    image: "/lovable-uploads/6e09ce2d-feb2-4a17-b898-f69caf6eab4e.png",
    location: "Lekki, Lagos",
    agency: "",
    verified: false,
    roi: "12.08%",
    annualReturn: "12.08%",
    supportedChains: ["ethereum", "solana", "polygon", "binance"]
  },
];

const Dashboard = () => {
  const [hasProperties, setHasProperties] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          {/* Sidebar - Mobile */}
          <div className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-propady-mint rounded-r-2xl p-4 space-y-8 z-20 md:hidden">
            <Button variant="ghost" size="icon" className="text-black hover:bg-propady-mint-light">
              <Plus size={24} />
            </Button>
            <Button variant="ghost" size="icon" className="text-black hover:bg-propady-mint-light">
              <Home size={24} />
            </Button>
            <Button variant="ghost" size="icon" className="text-black hover:bg-propady-mint-light">
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
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Your Portfolio</h1>
                  <p className="text-white/70">Manage your property here</p>
                </div>
                
                <div className="flex gap-2 mt-4 md:mt-0">
                  <ListPropertyForm />
                  <Button
                    className="bg-gradient-to-r from-propady-purple to-propady-purple-light text-white hover:opacity-90 transition-opacity"
                  >
                    Sell
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-propady-purple-light to-propady-mint text-white hover:opacity-90 transition-opacity"
                  >
                    Rent
                  </Button>
                </div>
              </div>
              
              {hasProperties ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {portfolioProperties.map((property, index) => (
                    <PropertyCard
                      key={index}
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
                  <h3 className="text-2xl font-semibold text-white/50 mb-4">You have No Property available</h3>
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
