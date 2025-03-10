
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
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import CryptoPayment from '@/components/payment/CryptoPayment';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, Eye, Info, ShieldCheck, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CrowdfundingProject {
  id: string;
  title: string;
  description: string;
  goal_amount: number;
  current_amount: number;
  image_url: string;
  end_date: string;
  creator_id: string;
  created_at: string;
  property_type: string;
  location: string;
}

interface CrowdfundingModalProps {
  project: CrowdfundingProject;
  progress: number;
  children: React.ReactNode;
}

const CrowdfundingModal = ({ project, progress, children }: CrowdfundingModalProps) => {
  const [open, setOpen] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const formatTimeLeft = (endDateString: string) => {
    const endDate = new Date(endDateString);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    
    if (diffTime <= 0) return 'Ended';
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) return `${diffDays} days left`;
    
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    return `${diffHours} hours left`;
  };

  const handleAuth = () => {
    setOpen(false);
    navigate('/auth');
  };
  
  const handleInvest = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to invest in this project",
        variant: "destructive",
      });
      return;
    }
    
    if (!investmentAmount || parseFloat(investmentAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid investment amount",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Record the investment
      const { error: investmentError } = await supabase
        .from('crowdfunding_investments')
        .insert({
          project_id: project.id,
          investor_id: user.id,
          amount: parseFloat(investmentAmount)
        });
      
      if (investmentError) throw investmentError;
      
      // Update the project's current amount
      const { error: updateError } = await supabase
        .from('crowdfunding_projects')
        .update({ 
          current_amount: project.current_amount + parseFloat(investmentAmount) 
        })
        .eq('id', project.id);
      
      if (updateError) throw updateError;
      
      toast({
        title: "Investment successful!",
        description: `You've successfully invested $${investmentAmount} in ${project.title}`,
      });
      
      setInvestmentAmount('');
      setOpen(false);
      
      // Refresh the page to show updated investment
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error('Error processing investment:', error);
      toast({
        title: "Investment failed",
        description: "There was an error processing your investment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] bg-background border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Invest in Project</DialogTitle>
          <DialogDescription className="text-white/70">
            Join other investors in funding this real estate project
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4">
          <div>
            <div className="aspect-video rounded-lg overflow-hidden mb-4">
              <img 
                src={project.image_url || "/lovable-uploads/9cf1c88a-5f50-447e-a034-cb6515047de2.png"} 
                alt={project.title} 
                className="w-full h-full object-cover" 
              />
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-1">{project.title}</h3>
            <p className="text-white/70 text-sm mb-2">{project.location}</p>
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-white/70 text-sm">
                <Users className="w-4 h-4 mr-1" />
                <span>42 Investors</span>
              </div>
              <div className="flex items-center text-white/70 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                <span>{formatTimeLeft(project.end_date)}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70">Current Funding</span>
                <span className="text-white font-bold">${project.current_amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70">Target Goal</span>
                <span className="text-white font-bold">${project.goal_amount.toLocaleString()}</span>
              </div>
              <div className="mt-3 mb-1">
                <Progress value={progress} className="h-2 bg-white/10" />
              </div>
              <div className="flex justify-end">
                <span className="text-propady-mint font-bold text-sm">{progress}% Funded</span>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <ShieldCheck className="text-propady-mint h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-white/70">
                All crowdfunding projects are verified on the blockchain for secure and transparent investment tracking
              </p>
            </div>
            
            <Separator className="bg-white/10" />
            
            {user ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-white text-sm">Investment Amount ($)</label>
                  <Input 
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    placeholder="Enter amount to invest"
                    className="bg-white/5 border-white/20 text-white"
                  />
                  <p className="text-xs text-white/60 flex items-center">
                    <Info className="w-3 h-3 mr-1" />
                    Minimum investment is $50
                  </p>
                </div>
                
                <Button 
                  className="w-full bg-propady-mint text-black hover:bg-propady-mint/90"
                  disabled={isSubmitting || !investmentAmount || parseFloat(investmentAmount) < 50}
                  onClick={handleInvest}
                >
                  {isSubmitting ? "Processing..." : "Confirm Investment"}
                </Button>
                
                <p className="text-xs text-center text-white/60">
                  Or invest with cryptocurrency
                </p>
                
                {investmentAmount && parseFloat(investmentAmount) >= 50 && (
                  <CryptoPayment 
                    amount={parseFloat(investmentAmount)} 
                    variant="full"
                    onSuccess={() => {
                      setOpen(false);
                      toast({
                        title: "Investment successful!",
                        description: `You've successfully invested $${investmentAmount} in ${project.title}`,
                      });
                      
                      setTimeout(() => {
                        window.location.reload();
                      }, 1500);
                    }}
                  />
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-white/70 text-sm">
                  You need to sign in to invest in this project.
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

        <div className="mt-2 p-4 bg-white/5 rounded-lg">
          <h4 className="text-white font-medium mb-2">About this project</h4>
          <p className="text-white/70 text-sm">{project.description}</p>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <Button 
            variant="ghost" 
            onClick={() => setOpen(false)}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          
          <Button 
            variant="outline" 
            className="border-white/10 text-white"
            onClick={() => {
              setOpen(false);
              // Navigate to a more detailed view if needed
              // navigate(`/crowdfunding/${project.id}`);
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Full Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CrowdfundingModal;
