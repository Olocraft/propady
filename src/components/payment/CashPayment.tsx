
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Check, CreditCard, DollarSign } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { recordTransaction } from '@/services/transactionService';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CashPaymentProps {
  amount: number;
  propertyId?: string;
  variant?: 'button' | 'full';
  onSuccess?: () => void;
}

const CashPayment = ({ 
  amount, 
  propertyId,
  variant = 'button',
  onSuccess 
}: CashPaymentProps) => {
  const [open, setOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'confirm'>('form');
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  
  // Form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to complete this transaction",
        variant: "destructive"
      });
      return;
    }
    
    if (!propertyId) {
      toast({
        title: "Invalid property",
        description: "Could not identify the property for this transaction",
        variant: "destructive"
      });
      return;
    }
    
    // Validate form
    if (!cardNumber || !expiryDate || !cvv || !cardName) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    setPaymentStep('processing');
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Record the transaction in our database
      const success = await recordTransaction({
        propertyId,
        amount,
        cryptoSymbol: 'USD',
        cryptoAmount: amount.toString(),
        buyerId: user.id
      });
      
      if (success) {
        setPaymentStep('confirm');
        
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1000);
        }
        
        toast({
          title: "Payment successful",
          description: `You've successfully paid $${amount}`,
        });
      } else {
        throw new Error("Transaction recording failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment",
        variant: "destructive"
      });
      setPaymentStep('form');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const resetPaymentFlow = () => {
    setPaymentStep('form');
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setCardName('');
    setIsProcessing(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={(value) => {
      setOpen(value);
      if (!value) resetPaymentFlow();
    }}>
      <DialogTrigger asChild>
        {variant === 'button' ? (
          <Button className="bg-white text-black hover:bg-white/90">
            <DollarSign className="mr-2 h-4 w-4" />
            Pay with Cash
          </Button>
        ) : (
          <div className="w-full p-4 border border-white/10 rounded-lg bg-black/20 backdrop-blur-md hover:bg-black/30 transition cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium mb-1">Card Payment</h3>
                <p className="text-white/70 text-sm">Pay with credit or debit card</p>
              </div>
              <CreditCard className="h-6 w-6 text-white" />
            </div>
          </div>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-background border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>
            {paymentStep === 'form' && 'Pay with Card'}
            {paymentStep === 'processing' && 'Processing Payment'}
            {paymentStep === 'confirm' && 'Payment Successful'}
          </DialogTitle>
          <DialogDescription className="text-white/70">
            {paymentStep === 'form' && 'Enter your card details to complete this purchase'}
            {paymentStep === 'processing' && 'Your payment is being processed, please wait'}
            {paymentStep === 'confirm' && 'Your transaction has been completed successfully'}
          </DialogDescription>
        </DialogHeader>
        
        {paymentStep === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                type="text"
                placeholder="XXXX XXXX XXXX XXXX"
                className="bg-white/5 border-white/10 text-white"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength={19}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="text"
                  placeholder="MM/YY"
                  className="bg-white/5 border-white/10 text-white"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  maxLength={5}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="text"
                  placeholder="XXX"
                  className="bg-white/5 border-white/10 text-white"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  maxLength={3}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardName">Name on Card</Label>
              <Input
                id="cardName"
                type="text"
                placeholder="Full name on card"
                className="bg-white/5 border-white/10 text-white"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
            </div>
            
            <Separator className="bg-white/10" />
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-white/70">Amount:</p>
                <p className="text-lg font-semibold text-white">${amount.toLocaleString()}</p>
              </div>
              
              <Button 
                type="submit" 
                className="bg-white text-black hover:bg-white/90"
              >
                Complete Payment
              </Button>
            </div>
          </form>
        )}
        
        {paymentStep === 'processing' && (
          <div className="py-8 flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-propady-mint border-t-transparent rounded-full animate-spin mb-4"></div>
            <h3 className="text-lg font-medium mb-2">Processing Payment</h3>
            <p className="text-white/70 text-center">
              Please don't close this window. We're processing your payment of ${amount.toLocaleString()}.
            </p>
          </div>
        )}
        
        {paymentStep === 'confirm' && (
          <div className="py-4 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">Payment Complete!</h3>
            <p className="text-white/70 mb-4">
              You've successfully paid ${amount.toLocaleString()}
            </p>
            <p className="text-sm text-white/60 mb-4">
              Transaction ID: {Math.random().toString(36).substring(2, 15)}...
            </p>
            <Button 
              onClick={() => setOpen(false)}
              className="bg-white text-black hover:bg-white/90"
            >
              Done
            </Button>
          </div>
        )}
        
        {paymentStep === 'form' && (
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              Cancel
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CashPayment;
