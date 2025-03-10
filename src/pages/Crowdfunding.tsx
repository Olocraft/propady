
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter, Users, Clock } from 'lucide-react';
import CreateProjectModal from '@/components/crowdfunding/CreateProjectModal';
import CrowdfundingModal from '@/components/crowdfunding/CrowdfundingModal';
import { useMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

// Define project interface to match the database schema
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
  const [filteredProjects, setFilteredProjects] = useState<CrowdfundingProject[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  
  const isMobile = useMobile();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('crowdfunding_projects')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data) {
          setProjects(data as CrowdfundingProject[]);
          setFilteredProjects(data as CrowdfundingProject[]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Failed to load projects",
          description: "There was an error loading crowdfunding projects.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  useEffect(() => {
    // Filter projects based on search query and category
    let result = [...projects];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        project => 
          project.title.toLowerCase().includes(query) || 
          project.description.toLowerCase().includes(query) ||
          project.location.toLowerCase().includes(query)
      );
    }
    
    if (selectedCategory !== 'all') {
      result = result.filter(project => project.property_type === selectedCategory);
    }
    
    setFilteredProjects(result);
  }, [searchQuery, selectedCategory, projects]);

  const calculateProgress = (current: number, goal: number) => {
    const progress = (current / goal) * 100;
    return Math.min(Math.round(progress), 100);
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

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('crowdfunding_projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setProjects(data as CrowdfundingProject[]);
        setFilteredProjects(data as CrowdfundingProject[]);
      }
    } catch (error) {
      console.error('Error refreshing projects:', error);
      toast({
        title: "Failed to refresh projects",
        description: "There was an error refreshing the projects list.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Property Crowdfunding</h1>
            <p className="text-white/70">Invest in real estate projects alongside other investors</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <CreateProjectModal onSuccess={handleRefresh} />
          </div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
              <Input 
                type="text"
                placeholder="Search projects..."
                className="pl-10 bg-white/5 border-white/10 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-auto flex-1">
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="w-full bg-white/5">
                  <TabsTrigger value="all" className="data-[state=active]:bg-propady-mint data-[state=active]:text-black">
                    All Projects
                  </TabsTrigger>
                  <TabsTrigger value="Residential" className="data-[state=active]:bg-propady-mint data-[state=active]:text-black">
                    Residential
                  </TabsTrigger>
                  <TabsTrigger value="Commercial" className="data-[state=active]:bg-propady-mint data-[state=active]:text-black">
                    Commercial
                  </TabsTrigger>
                  <TabsTrigger value="Land" className="data-[state=active]:bg-propady-mint data-[state=active]:text-black">
                    Land
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {!isMobile && (
              <div className="flex-shrink-0">
                <Button variant="outline" size="icon" className="border-white/10">
                  <Filter className="h-4 w-4 text-white" />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white/5 rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-white/10"></div>
                <div className="p-5 space-y-4">
                  <div className="h-6 bg-white/10 rounded w-3/4"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                  <div className="h-2 bg-white/10 rounded w-full"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-white/10 rounded w-1/4"></div>
                    <div className="h-4 bg-white/10 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-white mb-2">No projects found</h3>
            <p className="text-white/70 mb-6">Try adjusting your search or filters, or create a new project</p>
            <CreateProjectModal onSuccess={handleRefresh} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const progress = calculateProgress(project.current_amount, project.goal_amount);
              
              return (
                <CrowdfundingModal key={project.id} project={project} progress={progress}>
                  <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-propady-mint/50 transition-colors cursor-pointer">
                    <div className="aspect-video bg-gray-900 relative">
                      <img 
                        src={project.image_url || "/lovable-uploads/9cf1c88a-5f50-447e-a034-cb6515047de2.png"} 
                        alt={project.title} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute top-3 right-3 bg-propady-mint text-black text-xs font-bold px-2 py-1 rounded">
                        {project.property_type}
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-white mb-1">{project.title}</h3>
                      <p className="text-white/70 text-sm mb-3">{project.location}</p>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/70">${project.current_amount.toLocaleString()}</span>
                          <span className="text-white font-bold">${project.goal_amount.toLocaleString()}</span>
                        </div>
                        <Progress value={progress} className="h-2 bg-white/10" />
                        <div className="flex justify-end mt-1">
                          <span className="text-propady-mint text-xs font-bold">{progress}% Funded</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-white/70 text-xs">
                          <Users className="w-3 h-3 mr-1" />
                          <span>42 Investors</span>
                        </div>
                        <div className="flex items-center text-white/70 text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{formatTimeLeft(project.end_date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CrowdfundingModal>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Crowdfunding;
