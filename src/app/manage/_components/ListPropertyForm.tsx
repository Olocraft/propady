import React, { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, Image as ImageIcon } from "lucide-react";

import Img from "@/components/Img";
import {
  getPublicUrl,
  updatePropertyWithImgUrls,
  uploadImage,
} from "@/lib/actions/upload-property";
import { toast } from "sonner";
import { supabase } from "@/db/db";
import { useAuth } from "@/context/AuthContext";

const GAS_FEE = 0.005; // Fixed gas fee in ETH

interface PreviewImage {
  file: File;
  preview: string;
}

type FormData = {
  title: string;
  price: string;
  location: string;
  description: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  images: PreviewImage[];
};

const ListPropertyForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    price: "",
    location: "",
    description: "",
    propertyType: "Residential",
    bedrooms: "",
    bathrooms: "",
    area: "",
    images: [],
  });

  const {
    title,
    price,
    propertyType,
    location,
    description,
    bathrooms,
    bedrooms,
    area,
    images,
  } = formData;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement & HTMLTextAreaElement>
  ) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      const newImages = newFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setFormData((prev) => {
        return {
          ...prev,
          images: [...prev.images, ...newImages],
        };
      });
    } else {
      const { value, id } = e.target;

      setFormData((prev) => {
        return {
          ...prev,
          [id]: value,
        };
      });
    }

    return;
  };

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      location: "",
      description: "",
      propertyType: "Residential",
      bedrooms: "",
      bathrooms: "",
      area: "",
      images: [],
    });
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setFormData((prev) => {
      return {
        ...prev,
        images: newImages,
      };
    });
  };

  const setPropertyType = (value: string) => {
    setFormData((prev) => {
      return {
        ...prev,
        propertyType: value,
      };
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to list a property");
      return;
    }

    if (!title || !price || !location) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsLoading(true);

      // First, create the property record
      const { data, error } = await supabase
        .from("properties")
        .insert({
          title,
          price: parseFloat(price),
          location,
          description,
          bedrooms: bedrooms ? parseInt(bedrooms) : null,
          bathrooms: bathrooms ? parseInt(bathrooms) : null,
          area: area ? parseFloat(area) : null,
          property_type: propertyType,
          owner_id: user.id,
          images: [], // We'll update this after uploading
        })
        .select();

      if (error) throw error;

      if (images.length > 0 && data?.[0]?.id) {
        const propertyId = data[0].id;
        const imageUrls = [];

        for (const image of images) {
          const file = image.file;
          const fileName = `${Date.now()}-${file.name}`;
          const { success, message } = await uploadImage(
            propertyId,
            fileName,
            file
          );

          if (!success) {
            console.error("Error uploading image: ", message);
            continue;
          }

          // Get the public URL
          const { data: publicUrlData } = await getPublicUrl(
            propertyId,
            fileName
          );

          if (success && publicUrlData) {
            imageUrls.push(publicUrlData);
          }
        }

        // Update the property with image URLs
        if (imageUrls.length > 0) {
          await updatePropertyWithImgUrls(imageUrls, propertyId);
        }

        toast.success(
          `Your property has been listed with a gas fee of ${GAS_FEE} ETH`
        );

        resetForm();
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error listing property:", error);
      toast.error("An error occurred while listing your property");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <div>
          <Button className="bg-gradient-to-r from-propady-purple to-propady-mint text-white hover:opacity-90 transition-opacity">
            <Plus className="mr-2 h-4 w-4" /> List New Property
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] bg-background border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            List Your Property
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">
              Property Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={handleChange}
              placeholder="Enter property title"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-white">
                Price (USD)
              </Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={handleChange}
                placeholder="Enter property price"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyType" className="text-white">
                Property Type
              </Label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger
                  id="propertyType"
                  className="bg-white/5 border-white/10 text-white"
                >
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-background border-white/10">
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Land">Land</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-white">
              Location
            </Label>
            <Input
              id="location"
              value={location}
              onChange={handleChange}
              placeholder="Enter property location"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms" className="text-white">
                Bedrooms
              </Label>
              <Input
                id="bedrooms"
                type="number"
                value={bedrooms}
                onChange={handleChange}
                placeholder="0"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms" className="text-white">
                Bathrooms
              </Label>
              <Input
                id="bathrooms"
                type="number"
                value={bathrooms}
                onChange={handleChange}
                placeholder="0"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area" className="text-white">
                Area (m²)
              </Label>
              <Input
                id="area"
                type="number"
                value={area}
                onChange={handleChange}
                placeholder="0"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={handleChange}
              placeholder="Enter property description"
              className="bg-white/5 border-white/10 text-white"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Images</Label>
            <div className="grid grid-cols-3 gap-2">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-md overflow-hidden bg-black/30"
                >
                  <Img
                    src={image.preview}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black/60 p-1 rounded-full hover:bg-black/80"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}

              {images.length < 6 && (
                <label className="flex flex-col items-center justify-center aspect-square rounded-md border border-dashed border-white/30 cursor-pointer hover:bg-white/5 transition-colors">
                  <ImageIcon className="h-8 w-8 text-white/50 mb-2" />
                  <span className="text-xs text-white/70">Add Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleChange}
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-white/50 mt-1">
              Upload up to 6 images (required main image)
            </p>
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
              {isLoading ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </span>
              ) : (
                "List Property"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ListPropertyForm;
