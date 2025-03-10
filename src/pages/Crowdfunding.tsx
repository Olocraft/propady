
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Clock, Users, TrendingUp, Building, DollarSign } from 'lucide-react';
import CrowdfundingModal from '@/components/crowdfunding/CrowdfundingModal';
import CreateProjectModal from '@/components/crowdfunding/CreateProjectModal';
import { useAuth } from '@/contexts/AuthContext';

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

const Crowdfunding = () => {
  const [projects, setProjects] = useState<CrowdfundingProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('crowdfunding_projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching crowdfunding projects:', error);
        toast({
          title: 'Error',
          description: 'Failed to load crowdfunding projects',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  const calculateProgress = (current: number, goal: number) => {
    return Math.min(Math.round((current / goal) * 100), 100);
  };

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

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    if (filter === 'trending') return calculateProgress(project.current_amount, project.goal_amount) > 50;
    if (filter === 'new') {
      const projectDate = new Date(project.created_at);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return projectDate > oneWeekAgo;
    }
    if (filter === 'ending-soon') {
      const endDate = new Date(project.end_date);
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
      return endDate < oneWeekFromNow && endDate > new Date();
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-28 pb-20 container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-propady-mint to-propady-purple-light bg-clip-text text-transparent mb-2">
              Crowdfund Real Estate Projects
            </h1>
            <p className="text-white/70 text-lg">
              Join forces with other investors to fund high-potential properties
            </p>
          </motion.div>
          
          <div className="mt-6 md:mt-0">
            <CreateProjectModal onSuccess={() => {
              setLoading(true);
              setTimeout(() => {
                // Refresh projects after creation
                window.location.reload();
              }, 1000);
            }} />
          </div>
        </div>
        
        <div className="mb-8 flex flex-wrap gap-3">
          {['all', 'trending', 'new', 'ending-soon'].map((filterOption) => (
            <Button
              key={filterOption}
              variant={filter === filterOption ? "default" : "outline"}
              className={
                filter === filterOption
                  ? "bg-propady-purple text-white hover:bg-propady-purple-light"
                  : "border-white/20 text-white hover:bg-white/10"
              }
              onClick={() => setFilter(filterOption)}
            >
              {filterOption === 'all' ? 'All Projects' : 
               filterOption === 'trending' ? 'Trending' : 
               filterOption === 'new' ? 'Newly Added' : 
               'Ending Soon'}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((_, i) => (
              <div key={i} className="bg-white/5 rounded-xl h-[400px] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <>
            {filteredProjects.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-2xl text-white mb-4">No projects found</h3>
                <p className="text-white/70 mb-8">Be the first to create a crowdfunding project!</p>
                <CreateProjectModal onSuccess={() => {
                  setLoading(true);
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                }} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="glass-morphism rounded-xl overflow-hidden"
                  >
                    <div className="relative">
                      <img 
                        src={project.image_url || "/lovable-uploads/9cf1c88a-5f50-447e-a034-cb6515047de2.png"} 
                        alt={project.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-propady-mint/90 text-black font-medium">
                          {project.property_type}
                        </Badge>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <div className="flex items-center text-white/90 text-sm">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{formatTimeLeft(project.end_date)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-white mb-1 line-clamp-1">{project.title}</h3>
                      <p className="text-white/70 text-sm mb-3">{project.location}</p>
                      
                      <p className="text-white/70 text-sm mb-4 line-clamp-2">{project.description}</p>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/70">Funded</span>
                          <span className="text-white font-medium">
                            ${project.current_amount.toLocaleString()} of ${project.goal_amount.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={calculateProgress(project.current_amount, project.goal_amount)} className="h-2 bg-white/10" />
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-white/70 text-sm">
                          <Users className="w-4 h-4 mr-1" />
                          <span>42 Investors</span>
                        </div>
                        <div className="flex items-center text-propady-mint text-sm">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          <span>{calculateProgress(project.current_amount, project.goal_amount)}% Funded</span>
                        </div>
                      </div>
                      
                      <CrowdfundingModal
                        project={project}
                        progress={calculateProgress(project.current_amount, project.goal_amount)}
                      >
                        <Button 
                          className="w-full bg-propady-purple hover:bg-propady-purple-light text-white"
                        >
                          Invest Now
                        </Button>
                      </CrowdfundingModal>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        <div className="mt-16 glass-morphism rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">How Crowdfunding Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-propady-purple flex items-center justify-center mb-4">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">1. Find a Project</h3>
              <p className="text-white/70">Browse through curated real estate projects that match your investment goals</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-propady-purple flex items-center justify-center mb-4">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">2. Invest Any Amount</h3>
              <p className="text-white/70">Contribute as little or as much as you want using cryptocurrency</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-propady-mint flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">3. Earn Returns</h3>
              <p className="text-white/70">Receive proportional returns based on your investment as the property generates income</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Crowdfunding;
