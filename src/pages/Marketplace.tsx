
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import PropertyCard from '@/components/ui/PropertyCard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Filter, Grid, List } from 'lucide-react';
import { fetchAllProperties, mapPropertyToDisplay, PropertyDisplay } from '@/services/propertyService';

// Mock agency data
const agencies = [
  {
    id: 1,
    name: "Horizon Estate",
    logo: "/lovable-uploads/cc3dd316-3700-4b84-9cbe-4af5b0a4ba28.png",
    transactionsCount: "1,029 Props Transactions",
    priceCeiling: "$20,000"
  },
  {
    id: 2,
    name: "Eastern Homes",
    logo: "/lovable-uploads/cc3dd316-3700-4b84-9cbe-4af5b0a4ba28.png",
    transactionsCount: "529 Props Transactions",
    priceCeiling: "$10,000"
  },
  {
    id: 3,
    name: "Kingdom",
    logo: "/lovable-uploads/cc3dd316-3700-4b84-9cbe-4af5b0a4ba28.png",
    transactionsCount: "456 Props Transactions",
    priceCeiling: "$10,000"
  },
  {
    id: 4,
    name: "Homez",
    logo: "/lovable-uploads/cc3dd316-3700-4b84-9cbe-4af5b0a4ba28.png",
    transactionsCount: "456 Props Transactions",
    priceCeiling: "$10,000"
  },
  {
    id: 5,
    name: "Find Cribs",
    logo: "/lovable-uploads/cc3dd316-3700-4b84-9cbe-4af5b0a4ba28.png",
    transactionsCount: "456 Props Transactions",
    priceCeiling: "$10,000"
  }
];

// Mock categories
const categories = [
  {
    id: "airplane",
    name: "Airplane sales",
    image: "/lovable-uploads/0ef9a1b3-5100-4a51-b446-be1f0172c4fd.png"
  },
  {
    id: "farm",
    name: "Farm Management",
    image: "/lovable-uploads/6e09ce2d-feb2-4a17-b898-f69caf6eab4e.png"
  },
  {
    id: "mortgage",
    name: "Mortgage Management",
    image: "/lovable-uploads/3eeac279-1354-4519-87b9-7561d83e730b.png"
  }
];

const Marketplace = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('land');
  const [viewMode, setViewMode] = useState('trending');
  const [properties, setProperties] = useState<PropertyDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Fetch properties from Supabase
    const getProperties = async () => {
      setLoading(true);
      try {
        const propertyData = await fetchAllProperties();
        const displayProperties = propertyData.map(mapPropertyToDisplay);
        setProperties(displayProperties);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };
    
    getProperties();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      <div className="pt-28 pb-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-propady-mint to-propady-purple-light bg-clip-text text-transparent">
            Start Your Investment Portfolio today
          </h1>
          <h2 className="text-xl text-white mt-2">Today's Top Listed Props close to you</h2>
        </motion.div>
        
        <div className="mb-8 flex flex-wrap gap-4">
          {['Land', 'Residential', 'Commercial', 'Explore Crowdfunded Projects'].map((tab, index) => (
            <Button
              key={index}
              variant={activeTab === tab.toLowerCase() ? "default" : "outline"}
              className={
                activeTab === tab.toLowerCase()
                  ? "bg-propady-purple text-white hover:bg-propady-purple-light"
                  : "border-white/20 text-white hover:bg-white/10"
              }
              onClick={() => setActiveTab(tab.toLowerCase())}
            >
              {tab}
            </Button>
          ))}
          
          <div className="ml-auto">
            <Button variant="link" className="text-white">
              See all properties
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <div key={index} className="bg-white/5 rounded-xl h-[400px] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {properties.length > 0 ? (
              properties.map((property, index) => (
                <PropertyCard
                  key={property.id}
                  {...property}
                  className="animate-enter"
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-white text-lg">No properties found. Check back later!</p>
              </div>
            )}
          </div>
        )}
        
        <div className="mb-8 flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white">Trending Real Estate Agencies</h2>
          
          <div className="ml-auto flex gap-2">
            <Button
              variant={viewMode === 'trending' ? "default" : "outline"}
              size="sm"
              className={
                viewMode === 'trending'
                  ? "bg-propady-purple text-white hover:bg-propady-purple-light"
                  : "border-white/20 text-white hover:bg-white/10"
              }
              onClick={() => setViewMode('trending')}
            >
              Trending
            </Button>
            <Button
              variant={viewMode === 'top' ? "default" : "outline"}
              size="sm"
              className={
                viewMode === 'top'
                  ? "bg-propady-purple text-white hover:bg-propady-purple-light"
                  : "border-white/20 text-white hover:bg-white/10"
              }
              onClick={() => setViewMode('top')}
            >
              Top
            </Button>
          </div>
        </div>
        
        <div className="glass-morphism rounded-xl overflow-hidden mb-16">
          <table className="w-full text-white">
            <thead className="bg-black/30">
              <tr>
                <th className="px-6 py-4 text-left">Rank</th>
                <th className="px-6 py-4 text-left">Estate Agency</th>
                <th className="px-6 py-4 text-left">Prop Investments</th>
                <th className="px-6 py-4 text-left">Price ceiling / Prop</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {agencies.map((agency, index) => (
                <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">{index + 1}.</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-propady-purple flex items-center justify-center">
                        <img src={agency.logo} alt={agency.name} className="w-6 h-6" />
                      </div>
                      <span>{agency.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{agency.transactionsCount}</td>
                  <td className="px-6 py-4">{agency.priceCeiling}</td>
                  <td className="px-6 py-4 text-right">
                    <Button className="bg-propady-purple hover:bg-propady-purple-light text-white">
                      Explore
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Other Listed Categories</h2>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            Explore Properties
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-morphism rounded-xl overflow-hidden aspect-square relative group cursor-pointer"
              onClick={() => navigate(`/category/${category.id}`)}
            >
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <h3 className="text-xl font-semibold text-white">{category.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
