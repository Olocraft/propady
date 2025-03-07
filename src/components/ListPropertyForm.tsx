
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const GAS_FEE = 0.005; // Fixed gas fee in ETH

const ListPropertyForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !price || !location) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to list a property",
          variant: "destructive",
        });
        return;
      }

      // First, create the property record
      const { data, error } = await supabase.from('properties').insert({
        title,
        price: parseFloat(price),
        location,
        description,
        owner_id: user.id,
        images: [], // We'll update this after uploading
      }).select();

      if (error) throw error;
      
      // If there are images, upload them to storage
      if (images.length > 0 && data?.[0]?.id) {
        const propertyId = data[0].id;
        const imageUrls = [];
        
        for (const image of images) {
          const fileName = `${Date.now()}-${image.name}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('properties')
            .upload(`${propertyId}/${fileName}`, image);
          
          if (uploadError) {
            console.error('Error uploading image:', uploadError);
            continue;
          }
          
          // Get the public URL
          const { data: publicUrlData } = supabase.storage
            .from('properties')
            .getPublicUrl(`${propertyId}/${fileName}`);
            
          if (publicUrlData?.publicUrl) {
            imageUrls.push(publicUrlData.publicUrl);
          }
        }
        
        // Update the property with image URLs
        if (imageUrls.length > 0) {
          await supabase
            .from('properties')
            .update({ images: imageUrls })
            .eq('id', propertyId);
        }
      }
      
      toast({
        title: "Property listed!",
        description: `Your property has been listed with a gas fee of ${GAS_FEE} ETH`,
      });
      
      // Reset form
      setTitle('');
      setPrice('');
      setLocation('');
      setDescription('');
      setImages([]);
      setIsOpen(false);
    } catch (error) {
      console.error('Error listing property:', error);
      toast({
        title: "Failed to list property",
        description: "An error occurred while listing your property",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setImages(prev => [...prev, ...fileArray]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-gradient-to-r from-propady-purple to-propady-mint text-white hover:opacity-90 transition-opacity"
        >
          <Plus className="mr-2 h-4 w-4" /> List New Property
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] bg-background border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">List Your Property</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Property Title</Label>
            <Input 
              id="title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter property title"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price" className="text-white">Price (USD)</Label>
            <Input 
              id="price" 
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter property price"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location" className="text-white">Location</Label>
            <Input 
              id="location" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter property location"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea 
              id="description" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter property description"
              className="bg-white/5 border-white/10 text-white"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="images" className="text-white">Images</Label>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-md border border-white/10 cursor-pointer">
                <Upload className="h-4 w-4 text-propady-mint" />
                <span className="text-white">Upload Images</span>
                <input 
                  type="file" 
                  id="images" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange} 
                />
              </label>
              {images.length > 0 && (
                <span className="text-white/70 text-sm">
                  {images.length} file{images.length > 1 ? 's' : ''} selected
                </span>
              )}
            </div>
          </div>
          
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-medium">Gas Fee:</span>
              <span className="text-propady-mint font-bold">{GAS_FEE} ETH</span>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-propady-purple to-propady-mint text-white hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "List Property"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ListPropertyForm;
