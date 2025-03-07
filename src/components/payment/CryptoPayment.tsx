
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Check, Copy, ExternalLink } from 'lucide-react';
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

// Supported cryptocurrency types
const CRYPTOCURRENCIES = [
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=024' },
  { id: 'sui', name: 'Sui', symbol: 'SUI', icon: 'https://cryptologos.cc/logos/sui-sui-logo.svg?v=024' },
  { id: 'klaytn', name: 'Klaytn', symbol: 'KLAY', icon: 'https://cryptologos.cc/logos/klaytn-klay-logo.svg?v=024' }
];

interface CryptoPaymentProps {
  amount: number;
  propertyId?: string;
  variant?: 'button' | 'full';
  onSuccess?: () => void;
}

const CryptoPayment = ({ 
  amount, 
  propertyId,
  variant = 'button',
  onSuccess 
}: CryptoPaymentProps) => {
  const [open, setOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState(CRYPTOCURRENCIES[0]);
  const [paymentStep, setPaymentStep] = useState<'select' | 'pay' | 'confirm'>('select');
  const [copied, setCopied] = useState(false);
  
  // Mock wallet address - in production, this would be generated per transaction
  const walletAddress = '0x3Dc6aA12dEc4136d5f48C3Ec582Cf77793deCf85';
  
  // Convert USD to crypto (mock conversion)
  const getCryptoAmount = () => {
    switch (selectedCrypto.id) {
      case 'ethereum':
        return (amount / 3500).toFixed(4);
      case 'sui':
        return (amount / 1.2).toFixed(2);
      case 'klaytn':
        return (amount / 0.15).toFixed(2);
      default:
        return '0';
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Address copied",
      description: "The wallet address has been copied to your clipboard."
    });
  };
  
  const handleSelectCrypto = (crypto: typeof CRYPTOCURRENCIES[0]) => {
    setSelectedCrypto(crypto);
    setPaymentStep('pay');
  };
  
  const mockConfirmPayment = () => {
    // In production, we'd validate the transaction on the blockchain
    setPaymentStep('confirm');
    setTimeout(() => {
      if (onSuccess) onSuccess();
      setOpen(false);
      toast({
        title: "Payment successful",
        description: `You've successfully paid ${getCryptoAmount()} ${selectedCrypto.symbol}`,
      });
    }, 1500);
  };
  
  const resetPaymentFlow = () => {
    setPaymentStep('select');
    setSelectedCrypto(CRYPTOCURRENCIES[0]);
  };
  
  return (
    <Dialog open={open} onOpenChange={(value) => {
      setOpen(value);
      if (!value) resetPaymentFlow();
    }}>
      <DialogTrigger asChild>
        {variant === 'button' ? (
          <Button className="bg-propady-mint text-black hover:bg-propady-mint/90">
            Pay with Crypto
          </Button>
        ) : (
          <div className="w-full p-4 border border-white/10 rounded-lg bg-black/20 backdrop-blur-md hover:bg-black/30 transition cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium mb-1">Cryptocurrency</h3>
                <p className="text-white/70 text-sm">Pay with ETH, SUI, or KLAY</p>
              </div>
              <div className="flex space-x-2">
                {CRYPTOCURRENCIES.map((crypto) => (
                  <img 
                    key={crypto.id}
                    src={crypto.icon} 
                    alt={crypto.name} 
                    className="w-6 h-6"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-background border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>
            {paymentStep === 'select' && 'Select Cryptocurrency'}
            {paymentStep === 'pay' && `Pay with ${selectedCrypto.name}`}
            {paymentStep === 'confirm' && 'Payment Successful'}
          </DialogTitle>
          <DialogDescription className="text-white/70">
            {paymentStep === 'select' && 'Choose your preferred cryptocurrency for this transaction'}
            {paymentStep === 'pay' && `Send exactly ${getCryptoAmount()} ${selectedCrypto.symbol} to complete the payment`}
            {paymentStep === 'confirm' && 'Your transaction has been confirmed on the blockchain'}
          </DialogDescription>
        </DialogHeader>
        
        {paymentStep === 'select' && (
          <div className="grid gap-4 py-4">
            {CRYPTOCURRENCIES.map((crypto) => (
              <div 
                key={crypto.id}
                onClick={() => handleSelectCrypto(crypto)}
                className="flex items-center p-3 border border-white/10 rounded-lg hover:bg-white/5 cursor-pointer transition"
              >
                <img src={crypto.icon} alt={crypto.name} className="w-8 h-8 mr-4" />
                <div className="flex-1">
                  <h4 className="font-medium">{crypto.name}</h4>
                  <p className="text-sm text-white/70">{crypto.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{getCryptoAmount()} {crypto.symbol}</p>
                  <p className="text-sm text-white/70">${amount} USD</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {paymentStep === 'pay' && (
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-3">
              <img src={selectedCrypto.icon} alt={selectedCrypto.name} className="w-8 h-8" />
              <div>
                <p className="font-medium">{selectedCrypto.name}</p>
                <p className="text-sm text-white/70">{getCryptoAmount()} {selectedCrypto.symbol}</p>
              </div>
            </div>
            
            <Separator className="bg-white/10" />
            
            <div className="p-4 bg-black/20 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm text-white/70">Send to this address:</p>
                <Button variant="outline" size="sm" onClick={handleCopy} className="h-8 border-white/10 text-white/80">
                  {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <p className="font-mono text-sm bg-black/30 p-2 rounded break-all">{walletAddress}</p>
              <p className="text-sm text-white/70 font-medium">Amount: {getCryptoAmount()} {selectedCrypto.symbol}</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-white/70 mb-4">After sending, click below to confirm your payment</p>
              <Button onClick={mockConfirmPayment} className="bg-propady-mint text-black hover:bg-propady-mint/90 w-full">
                I've Sent {getCryptoAmount()} {selectedCrypto.symbol}
              </Button>
            </div>
          </div>
        )}
        
        {paymentStep === 'confirm' && (
          <div className="py-4 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-propady-mint/20 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-propady-mint" />
            </div>
            <h3 className="text-xl font-medium mb-2">Payment Complete!</h3>
            <p className="text-white/70 mb-4">
              You've successfully paid {getCryptoAmount()} {selectedCrypto.symbol}
            </p>
            <p className="text-sm text-white/60 mb-4">
              Transaction ID: {Math.random().toString(36).substring(2, 15)}...
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-white/10 text-white/80"
              onClick={() => setOpen(false)}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              View on Blockchain
            </Button>
          </div>
        )}
        
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          {paymentStep !== 'confirm' && (
            <Button 
              variant="ghost" 
              onClick={() => paymentStep === 'pay' ? setPaymentStep('select') : setOpen(false)}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              {paymentStep === 'pay' ? 'Back' : 'Cancel'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CryptoPayment;
