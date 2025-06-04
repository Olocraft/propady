
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';
import CryptoPayment from '@/components/payment/CryptoPayment';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, Eye, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InvestmentModalProps {
  propertyId: string;
  title: string;
  price: string;
  image: string;
  location: string;
  roi: string;
  annualReturn: string;
  children: React.ReactNode;
}

const InvestmentModal = ({
  propertyId,
  title,
  price,
  image,
  location,
  roi,
  annualReturn,
  children
}: InvestmentModalProps) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Convert price string to number (remove $ and commas)
  const priceNumber = parseFloat(price.replace(/[$,]/g, ''));

  const handleAuth = () => {
    setOpen(false);
    navigate('/auth');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] bg-background border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Invest in Property</DialogTitle>
          <DialogDescription className="text-white/70">
            Review the details of this investment opportunity
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4">
          <div>
            <div className="aspect-video rounded-lg overflow-hidden mb-4">
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
            <p className="text-white/70 text-sm mb-2">{location}</p>
            <p className="text-xl font-bold text-white">{price}</p>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70">Total ROI</span>
                <span className="text-white font-bold">{roi}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70">Annual Return</span>
                <span className="text-white font-bold">{annualReturn}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Transaction Fee</span>
                <span className="text-white font-bold">2%</span>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <ShieldCheck className="text-propady-mint h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-white/70">
                All properties are verified on the blockchain for secure and transparent ownership
              </p>
            </div>
            
            <Separator className="bg-white/10" />
            
            {user ? (
              <div className="space-y-2">
                <p className="text-white font-medium">Choose payment method:</p>
                <CryptoPayment 
                  amount={priceNumber} 
                  propertyId={propertyId} 
                  variant="full"
                  onSuccess={() => {
                    setOpen(false);
                    navigate(`/property/${propertyId}`);
                  }}
                />
                <Button 
                  variant="outline" 
                  className="w-full mt-2 border-white/10 text-white"
                  onClick={() => {
                    setOpen(false);
                    navigate(`/property/${propertyId}`);
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Full Details
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-white/70 text-sm">
                  You need to sign in to invest in this property.
                </p>
                <Button 
                  className="w-full bg-propady-mint text-black hover:bg-propady-mint/90"
                  onClick={handleAuth}
                >
                  Sign In to Invest
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <Button 
            variant="ghost" 
            onClick={() => setOpen(false)}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentModal;
