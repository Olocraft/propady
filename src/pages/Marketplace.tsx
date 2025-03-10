import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import PropertyCard from '@/components/ui/PropertyCard';
import CryptoSection from '@/components/marketplace/CryptoSection';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Filter, Grid, List, Search, X } from 'lucide-react';
import { fetchAllProperties, PropertyDisplay } from '@/services/propertyService';
import { searchProperties } from '@/services/searchService';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

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
  const [filteredProperties, setFilteredProperties] = useState<PropertyDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [filtersApplied, setFiltersApplied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const getProperties = async () => {
      setLoading(true);
      try {
        const propertyData = await fetchAllProperties();
        setProperties(propertyData);
        setFilteredProperties(propertyData);
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast({
          title: "Error loading properties",
          description: "There was a problem fetching the properties. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    getProperties();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm && !filtersApplied) {
      setFilteredProperties(properties);
      return;
    }

    setLoading(true);
    
    try {
      const results = await searchProperties({
        searchTerm: searchTerm,
        minPrice: filtersApplied ? priceRange[0] : undefined,
        maxPrice: filtersApplied ? priceRange[1] : undefined,
        location: filtersApplied && selectedLocations.length > 0 ? selectedLocations.join(',') : undefined
      });
      
      setFilteredProperties(results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== 'land') {
      const filtered = properties.slice(0, properties.length > 3 ? 3 : properties.length);
      setFilteredProperties(filtered);
    } else {
      setFilteredProperties(properties);
    }
  }, [activeTab, properties]);

  const applyFilters = () => {
    setFiltersApplied(true);
    setFilterDialogOpen(false);
    handleSearch();
  };

  const clearFilters = () => {
    setPriceRange([0, 1000000]);
    setSelectedLocations([]);
    setFiltersApplied(false);
    setFilterDialogOpen(false);
    setFilteredProperties(properties);
  };

  const locations = [...new Set(properties.map(p => p.location))];

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
        </div>
        
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input 
              type="text"
              placeholder="Search properties..."
              className="pl-10 bg-white/5 border-white/10 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            {searchTerm && (
              <button 
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => {
                  setSearchTerm('');
                  if (!filtersApplied) {
                    setFilteredProperties(properties);
                  }
                }}
              >
                <X className="h-4 w-4 text-white/50" />
              </button>
            )}
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="border-white/10"
            onClick={() => setFilterDialogOpen(true)}
          >
            <Filter className="h-4 w-4 text-white" />
          </Button>
          
          <Button 
            onClick={handleSearch}
            className="bg-propady-mint text-black hover:bg-propady-mint/90"
          >
            Search
          </Button>
          
          {filtersApplied && (
            <Button 
              variant="outline" 
              className="border-white/10 text-white"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>
        
        <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
          <DialogContent className="bg-background border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Filter Properties</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <h3 className="font-medium">Price Range</h3>
                <div className="px-2">
                  <Slider 
                    value={priceRange} 
                    min={0} 
                    max={1000000} 
                    step={10000}
                    onValueChange={setPriceRange} 
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span>${priceRange[0].toLocaleString()}</span>
                  <span>${priceRange[1].toLocaleString()}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Locations</h3>
                <div className="grid grid-cols-2 gap-2">
                  {locations.map((location) => (
                    <div key={location} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`location-${location}`} 
                        checked={selectedLocations.includes(location)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedLocations([...selectedLocations, location]);
                          } else {
                            setSelectedLocations(selectedLocations.filter(l => l !== location));
                          }
                        }}
                      />
                      <Label htmlFor={`location-${location}`} className="text-white">{location}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between gap-2">
              <Button 
                variant="outline" 
                className="flex-1 border-white/10" 
                onClick={clearFilters}
              >
                Clear
              </Button>
              <Button 
                className="flex-1 bg-propady-mint text-black hover:bg-propady-mint/90"
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <div key={index} className="bg-white/5 rounded-xl h-[400px] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property, index) => (
                <PropertyCard
                  key={property.id}
                  {...property}
                  className="animate-enter"
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-white text-lg">No properties found. Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        )}
        
        <CryptoSection />
        
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
