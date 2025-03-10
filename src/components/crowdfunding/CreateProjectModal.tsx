
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CreateProjectModalProps {
  onSuccess?: () => void;
}

const propertyTypes = [
  'Residential',
  'Commercial',
  'Industrial',
  'Land',
  'Mixed-Use',
  'Special Purpose'
];

const CreateProjectModal = ({ onSuccess }: CreateProjectModalProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [location, setLocation] = useState('');
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a project",
        variant: "destructive",
      });
      return;
    }
    
    if (!title || !description || !goalAmount || !propertyType || !location || !endDate) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      let imageUrl = '/lovable-uploads/9cf1c88a-5f50-447e-a034-cb6515047de2.png'; // Default image
      
      // If user uploaded an image, store it in Supabase storage
      if (image) {
        const fileName = `${Date.now()}-${image.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('crowdfunding')
          .upload(`projects/${fileName}`, image);
        
        if (uploadError) {
          console.error('Error uploading image:', uploadError);
        } else {
          // Get the public URL
          const { data: publicUrlData } = supabase.storage
            .from('crowdfunding')
            .getPublicUrl(`projects/${fileName}`);
            
          if (publicUrlData?.publicUrl) {
            imageUrl = publicUrlData.publicUrl;
          }
        }
      }
      
      // Create the project in the database
      const { data, error } = await supabase
        .from('crowdfunding_projects')
        .insert({
          title,
          description,
          goal_amount: parseFloat(goalAmount),
          current_amount: 0,
          image_url: imageUrl,
          end_date: endDate?.toISOString(),
          creator_id: user.id,
          property_type: propertyType,
          location
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Project created!",
        description: "Your crowdfunding project has been published successfully.",
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setGoalAmount('');
      setPropertyType('');
      setLocation('');
      setEndDate(undefined);
      setImage(null);
      setOpen(false);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Failed to create project",
        description: "An error occurred while creating your project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-gradient-to-r from-propady-purple to-propady-mint text-white hover:opacity-90 transition-opacity"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Project
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[550px] bg-background border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Create Crowdfunding Project</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Project Title</Label>
            <Input 
              id="title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea 
              id="description" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the project and investment opportunity"
              className="bg-white/5 border-white/10 text-white"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goalAmount" className="text-white">Goal Amount ($)</Label>
              <Input 
                id="goalAmount" 
                type="number"
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
                placeholder="Funding goal"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="propertyType" className="text-white">Property Type</Label>
              <Select onValueChange={setPropertyType} value={propertyType}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-background border-white/10">
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-white hover:bg-white/10">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location" className="text-white">Location</Label>
            <Input 
              id="location" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Property location"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-white">Funding End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white/5 border-white/10 text-white",
                    !endDate && "text-white/50"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-background border-white/10">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                  className="bg-background text-white"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image" className="text-white">Project Image</Label>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-md border border-white/10 cursor-pointer">
                <Upload className="h-4 w-4 text-propady-mint" />
                <span className="text-white">Upload Image</span>
                <input 
                  type="file" 
                  id="image" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange} 
                />
              </label>
              {image && (
                <span className="text-white/70 text-sm">
                  {image.name}
                </span>
              )}
            </div>
          </div>
          
          <Button 
            type="button" 
            className="w-full bg-gradient-to-r from-propady-purple to-propady-mint text-white hover:opacity-90 transition-opacity"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Creating Project..." : "Create Project"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
