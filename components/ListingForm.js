"use client";
import React, { useState } from "react";
import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
// import { z } from "zod";
const ListingForm = () => {
    const [errors, setErrors] = useState({})
    const [selectedImages, setSelectedImages] = useState([]);
    const [imageError, setImageError] = useState("");
    const [category, setCategory] = useState("");
    const [customBhk, setCustomBhk] = useState(false);

    const handleFormSubmit = async (prevState, formData) => {
        try {
            const formValues = {
                title: formData.get("title"),
                description: formData.get("description"),
                category: formData.get("category"),
                link: formData.get("link"),
                pitch                
            }

            await formValidation.parseAsync(formValues);

            const result = await createPitch(prevState,formData, pitch)
            console.log(result);

            if (result?.status === 'SUCCESS') {
                toast({
                    title: "SUCCESS",
                    description: "Your Startup Pitch Has Been Created.",
                });
                router.push(`/startup/${result._id}`);
                router.refresh();
            }
            return result;
            
        } catch (error) {
            if(error instanceof z.ZodError){
                const fieldErrors = error.flatten().fieldErrors
                setErrors(fieldErrors)
                toast({
                    title:"Error",
                    description:"Please Check your input and try again",
                    variant: 'destructive'
                })
                return { ...prevState, error:"Validation Failed", status:"ERROR"}
            }
            console.log(error);
            
            toast({
                title:"Error",
                description:"Unexpected Error",
                variant: 'destructive'
            })
            return { ...prevState, error:"Unexpected Error", status:"ERROR"}

        }
    }
    const [state, formAction, isPending] = useActionState(handleFormSubmit,{
        error: '',
        status : "INITIAL"
    })

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        if (files.length < 2) {
            setImageError("Please select at least 2 images");
            return;
        }
        
        if (files.length > 10) {
            setImageError("Maximum 10 images allowed");
            return;
        }

        setImageError("");
        setSelectedImages(files);
    };

    return (
        <>
            <form action={formAction} className="startup-form">
            <div>
                <label htmlFor="title" className="startup-form_label">
                    Title
                </label>
                <Input 
                    id="title" 
                    name="title" 
                    className="startup-form_input" 
                    required 
                    placeholder="Startup Title"
                /> 

                {errors.title && <p className="startup-form_error">{errors.title}</p>}
            </div>

            <div>
                <label htmlFor="description" className="startup-form_label">
                    Description
                </label>
                <Textarea 
                    id="description" 
                    name="description" 
                    className="startup-form_textarea" 
                    required 
                    placeholder="Startup Description"
                /> 

                {errors.description && <p className="startup-form_error">{errors.description}</p>}
            </div>

            <div>
                <label htmlFor="category" className="startup-form_label">
                    Category
                </label>
                <Select 
                    name="category" 
                    required 
                    defaultValue="" 
                    onValueChange={(value) => setCategory(value)}
                >
                    <SelectTrigger className="startup-form_input">
                        <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                        <SelectItem value="rent">For Rent</SelectItem>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="plot">Plots/Land</SelectItem>
                    </SelectContent>
                </Select>
                {errors.category && <p className="startup-form_error">{errors.category}</p>}
            </div>

            {category === "rent" && (
                <div>
                    <label htmlFor="deposit" className="startup-form_label">
                        Security Deposit (₹)
                    </label>
                    <Input 
                        id="deposit" 
                        name="deposit" 
                        type="number"
                        className="startup-form_input" 
                        required 
                        placeholder="Enter security deposit amount"
                    /> 
                    {errors.deposit && <p className="startup-form_error">{errors.deposit}</p>}
                </div>
            )}

            <div>
                <label htmlFor="bhk" className="startup-form_label">
                    BHK
                </label>
                <Select 
                    name="bhk" 
                    required 
                    defaultValue="" 
                    onValueChange={(value) => {
                        if (value === "other") {
                            setCustomBhk(true);
                        } else {
                            setCustomBhk(false);
                        }
                    }}
                >
                    <SelectTrigger className="startup-form_input">
                        <SelectValue placeholder="Select BHK" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                        <SelectItem value="1">1 BHK</SelectItem>
                        <SelectItem value="1.5">1.5 BHK</SelectItem>
                        <SelectItem value="2">2 BHK</SelectItem>
                        <SelectItem value="2.5">2.5 BHK</SelectItem>
                        <SelectItem value="3">3 BHK</SelectItem>
                        <SelectItem value="3.5">3.5 BHK</SelectItem>
                        <SelectItem value="4">4 BHK</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>

                {customBhk && (
                    <div className="mt-2">
                        <Input 
                            id="custom_bhk" 
                            name="bhk" 
                            type="number"
                            step="0.5"
                            min="0.5"
                            className="startup-form_input" 
                            required 
                            placeholder="Enter custom BHK value"
                        /> 
                    </div>
                )}

                {errors.bhk && <p className="startup-form_error">{errors.bhk}</p>}
            </div>

            <div>
                <label htmlFor="sqft" className="startup-form_label">
                    Area (sq.ft)
                </label>
                <Input 
                    id="sqft" 
                    name="sqft" 
                    type="number"
                    className="startup-form_input" 
                    required 
                    placeholder="Enter carpet area in sq.ft"
                /> 
                {errors.sqft && <p className="startup-form_error">{errors.sqft}</p>}
            </div>

            <div>
                <label htmlFor="furnishing" className="startup-form_label">
                    Furnishing Status
                </label>
                <Select name="furnishing" required defaultValue="">
                    <SelectTrigger className="startup-form_input">
                        <SelectValue placeholder="Select furnishing status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                        <SelectItem value="full">Fully Furnished</SelectItem>
                        <SelectItem value="semi">Semi Furnished</SelectItem>
                        <SelectItem value="none">Unfurnished</SelectItem>
                    </SelectContent>
                </Select>
                {errors.furnishing && <p className="startup-form_error">{errors.furnishing}</p>}
            </div>

            <div>
                <label className="startup-form_label">Configuration</label>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="bedrooms" className="startup-form_label !text-[15px] !text-gray-600">Bedrooms</label>
                        <Input 
                            id="bedrooms" 
                            name="bedrooms" 
                            type="number"
                            min="1"
                            className="startup-form_input" 
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor="bathrooms" className="startup-form_label !text-[15px] !text-gray-600">Bathrooms</label>
                        <Input 
                            id="bathrooms" 
                            name="bathrooms" 
                            type="number"
                            min="1"
                            className="startup-form_input" 
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor="balconies" className="startup-form_label !text-[15px] !text-gray-600">Balconies</label>
                        <Input 
                            id="balconies" 
                            name="balconies" 
                            type="number"
                            min="0"
                            className="startup-form_input" 
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor="parking" className="startup-form_label !text-[15px] !text-gray-600">Parking Spots</label>
                        <Input 
                            id="parking" 
                            name="parking" 
                            type="number"
                            min="0"
                            className="startup-form_input" 
                            required 
                        />
                    </div>
                </div>
                {errors.configuration && <p className="startup-form_error">{errors.configuration}</p>}
            </div>

            <div>
                <label htmlFor="price" className="startup-form_label">
                    {category === "rent" ? "Monthly Rent (₹)" : "Price (₹)"}
                </label>
                <Input 
                    id="price" 
                    name="price" 
                    type="number"
                    className="startup-form_input" 
                    required 
                    placeholder={category === "rent" ? "Enter monthly rent" : "Enter property price"}
                /> 
                {errors.price && <p className="startup-form_error">{errors.price}</p>}
            </div>

            <div>
                <label htmlFor="images" className="startup-form_label">
                    Property Images
                </label>
                <div className="flex flex-col gap-2">
                    <div className="relative">
                        <Input 
                            id="images" 
                            name="images" 
                            type="file"
                            multiple
                            accept="image/*"
                            className="startup-form_input hidden" 
                            required 
                            onChange={handleImageChange}
                        />
                        <Button 
                            type="button"
                            onClick={() => document.getElementById('images').click()}
                            className="startup-form_input flex items-center justify-center gap-2 hover:bg-gray-50"
                        >
                            <Upload className="h-5 w-5" />
                            Choose Images
                        </Button>
                    </div>

                    {selectedImages.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                            {selectedImages.map((file, index) => (
                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                                    <img 
                                        src={URL.createObjectURL(file)} 
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <Button
                                        type="button"
                                        className="absolute top-2 right-2 h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 p-0"
                                        onClick={() => {
                                            const newImages = selectedImages.filter((_, i) => i !== index);
                                            setSelectedImages(newImages);
                                            if (newImages.length < 2) {
                                                setImageError("Please select at least 2 images");
                                            }
                                        }}
                                    >
                                        ×
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    {imageError && (
                        <p className="startup-form_error">{imageError}</p>
                    )}
                    
                    <p className="text-sm text-gray-500">
                        Select 2-10 images of your property. First image will be the cover image.
                    </p>
                </div>

                {errors.images && <p className="startup-form_error">{errors.images}</p>}
            </div>

            <Button type="submit" className="startup-form_btn text-white" disabled={isPending}>
                {isPending ? "Submiting..." : "Submit"}
                <Send className="size-6 ml-2"/>
            </Button>
                
            </form>
        </>
    )
}

export default ListingForm;