
import React from 'react';
import { ArrowLeft, Check, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export interface PropertyDetailsProps {
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
  actionButton?: React.ReactNode;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  id,
  title,
  price,
  mainImage,
  additionalImages,
  location,
  agency,
  verified,
  features,
  onBack,
  actionButton
}) => {
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Property link has been copied to clipboard",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Button 
          onClick={onBack} 
          variant="ghost" 
          className="text-white hover:bg-white/10 p-0 h-auto"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to marketplace
        </Button>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="border-white/10 text-white hover:bg-white/10"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share property</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <AspectRatio ratio={16 / 9}>
            <img 
              src={mainImage} 
              alt={title} 
              className="rounded-lg w-full h-full object-cover" 
            />
          </AspectRatio>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            {additionalImages.map((img, i) => (
              <div key={i} className="aspect-video">
                <img 
                  src={img} 
                  alt={`${title} ${i+1}`}
                  className="rounded-lg w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="glass-morphism border-white/10 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
                <p className="text-white/70 mb-1">{location}</p>
                <p className="text-sm text-white/50">Listed by {agency}</p>
              </div>
              
              {verified && (
                <Badge className="bg-propady-mint/20 text-propady-mint flex items-center">
                  <Check className="w-3 h-3 mr-1" /> Verified
                </Badge>
              )}
            </div>
            
            <div className="my-6">
              <p className="text-3xl font-bold text-white">{price}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-white font-medium mb-3">Features</h3>
              <div className="grid grid-cols-2 gap-2">
                {features.map((feature, i) => (
                  <div key={i} className="text-white/70 text-sm flex items-center">
                    <div className="w-2 h-2 rounded-full bg-propady-mint mr-2"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
            
            {actionButton && (
              <div className="mt-6">
                {actionButton}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
