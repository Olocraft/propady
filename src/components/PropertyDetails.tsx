
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, FileText, Clock, Clipboard, Building, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface PropertyDetailsProps {
  id: string;
  title: string;
  price: string;
  mainImage: string;
  additionalImages: string[];
  location: string;
  agency: string;
  verified: boolean;
  features: string[];
  onBack: () => void;
}

const PropertyDetails = ({
  id,
  title,
  price,
  mainImage,
  additionalImages,
  location,
  agency,
  verified,
  features,
  onBack
}: PropertyDetailsProps) => {
  const [activeImage, setActiveImage] = useState(mainImage);
  const [isInspecting, setIsInspecting] = useState(false);

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-morphism rounded-xl overflow-hidden mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-xl overflow-hidden mb-4"
            >
              <img src={activeImage} alt={title} className="w-full h-[300px] object-cover" />
            </motion.div>
            
            <div className="grid grid-cols-4 gap-2">
              {[mainImage, ...additionalImages].slice(0, 4).map((img, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`
                    rounded-lg overflow-hidden cursor-pointer border-2 
                    ${img === activeImage ? 'border-propady-mint' : 'border-transparent'}
                  `}
                  onClick={() => setActiveImage(img)}
                >
                  <img src={img} alt={`View ${index + 1}`} className="w-full h-20 object-cover" />
                </motion.div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center">
                  {title}
                  {verified && (
                    <span className="ml-2 text-sm bg-propady-mint/30 text-propady-mint px-2 py-1 rounded-md">
                      verified
                    </span>
                  )}
                </h1>
                <div className="flex items-center text-white/70 mt-2">
                  <MapPin size={16} className="mr-1" />
                  <span>{location}</span>
                </div>
                <div className="flex items-center text-white/70 mt-1">
                  <Building size={16} className="mr-1" />
                  <span>{agency}</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-white">{price}</div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Features</h3>
              <ul className="text-white/80 space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10 py-6 text-lg"
                onClick={() => setIsInspecting(true)}
              >
                Inspect
              </Button>
              <Button
                variant="default"
                className="w-full bg-black text-white hover:bg-black/80 py-6 text-lg"
              >
                Bid
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
      
      {isInspecting && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-morphism rounded-xl p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-morphism rounded-xl p-6 text-center flex flex-col items-center">
              <FileText size={32} className="text-propady-mint mb-3" />
              <h3 className="font-semibold text-white mb-1">Property History</h3>
              <p className="text-white/70 text-sm mb-4">View ownership and transaction history</p>
              <Button variant="outline" className="w-full mt-auto border-white/20 text-white hover:bg-white/10">
                View History
              </Button>
            </div>
            
            <div className="glass-morphism rounded-xl p-6 text-center flex flex-col items-center">
              <MapPin size={32} className="text-propady-mint mb-3" />
              <h3 className="font-semibold text-white mb-1">Locate on map</h3>
              <p className="text-white/70 text-sm mb-4">See property location and nearby amenities</p>
              <Button variant="outline" className="w-full mt-auto border-white/20 text-white hover:bg-white/10">
                Open Map
              </Button>
            </div>
            
            <div className="glass-morphism rounded-xl p-6 text-center flex flex-col items-center">
              <Clock size={32} className="text-propady-mint mb-3" />
              <h3 className="font-semibold text-white mb-1">Price History</h3>
              <p className="text-white/70 text-sm mb-4">View historical pricing data</p>
              <Button variant="outline" className="w-full mt-auto border-white/20 text-white hover:bg-white/10">
                View Prices
              </Button>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col items-center">
            <Button 
              variant="default" 
              size="lg" 
              className="w-full max-w-md bg-black text-white hover:bg-black/80 py-6 text-lg"
            >
              Review Documentation
            </Button>
            
            <Button 
              variant="link"
              className="text-white/70 hover:text-white mt-4"
              onClick={() => setIsInspecting(false)}
            >
              <ArrowLeft size={16} className="mr-1" /> Back to property details
            </Button>
          </div>
        </motion.div>
      )}
      
      <div className="flex justify-center">
        <Button
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
          onClick={onBack}
        >
          <ArrowLeft size={16} className="mr-1" /> Back
        </Button>
      </div>
    </div>
  );
};

export default PropertyDetails;
