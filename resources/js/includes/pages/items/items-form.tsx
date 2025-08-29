import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {Link } from '@inertiajs/react';
import axios from 'axios';
import React, { useState, useRef } from 'react'; 

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DisplayAlertMessage } from "@/alert-dialogs/alert-message";
import { 
    Dropzone, 
    DropzoneContent, 
    DropzoneEmptyState 
} from '@/components/ui/dropzone';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"



const formSchema = z.object({
    categories_id: z.string().min(1, {
        message: "Category is required",
    }),
    items_code: z.string().min(2, {
        message: "Item Code must be at least 2 characters.",
    }),
    items_name: z.string().min(2, {
        message: "Item Name must be at least 2 characters.",
    }),
    items_image : z.instanceof(File)
        .refine(file => file.size <= 5 * 1024 * 1024, {
            message: "File must be less than 5MB",
        })
        .refine(file => ["image/png", "image/jpeg"].includes(file.type), {
            message: "Only PNG or JPEG images are allowed",
        }),
    items_price: z.coerce.number().gt(0, {
        message: "Price must be greater than 0",
    }),
    items_discount_rate: z.coerce.number().min(0, {
        message: "Must be a positive number"
    }), 
    items_discounted_price: z.coerce.number(),
})

export default function ItemsForm(data) {
    const [files, setFiles] = useState<File[] | undefined>();
    const [filePreview, setFilePreview] = useState<string | undefined>(data.children.item_details && data.children.item_details.items_image ? data.children.item_details.items_image : '');
    const [originalPrice, setOriginalPrice] = useState(data.children.item_details && data.children.item_details.price ? data.children.item_details.price : 0);
    const [discountPercent, setDiscountPercent] = useState(data.children.item_details && data.children.item_details.discounted_rate ? data.children.item_details.discounted_rate : 0);
    const [discountedPrice, setDiscountedPrice] = useState(data.children.item_details && data.children.item_details.discounted_price ? data.children.item_details.discounted_price : 0);
    const [open, setOpen] = React.useState(false);
    const [resultDialogContent, setResultDialogContent] = useState({
        title: "Result",
        description: "This is a sample", 
        onAction: () => {
            setOpen(false)
        },
    });
    console.log(filePreview);
    const handleDrop = (fieldOnChange: (value: File) => void) =>(acceptedFiles: File[]) => {
        console.log(acceptedFiles);
        setFiles(acceptedFiles);
        const file = acceptedFiles[0];
        if (file) {
            fieldOnChange(file); // update RHF state
            setFilePreview(URL.createObjectURL(file)); // update preview
        }

        // if (acceptedFiles.length > 0) {
        //     const reader = new FileReader();
        //     reader.onload = (e) => {
        //         if (typeof e.target?.result === 'string') {
        //             setFilePreview(e.target?.result);
        //         }
        //     };
        //     reader.readAsDataURL(files[0]);
        //     const file = acceptedFiles[0];
        //     if (file) {
        //         field.onChange(file); // update RHF state
        //         setFilePreview(URL.createObjectURL(file)); // for preview
        //     }

        // }
    };
    let itemsId = data.children.item_details && data.children.item_details.id ? data.children.item_details.id : '';
    let formUrl = "/api/items/store";

    // const handleKeyUp = (e) => {
    //     const value = parseFloat(e.target.value) || 0;
    //     const taxRate = 0.12; // 12% VAT
    //     const computed = value + value * taxRate;
    //     setFinalPrice(computed.toFixed(2));
    // };

    const handlePriceChange = (e) => {
        const value = e.target.value;
        setOriginalPrice(value);
        setDiscountedPrice(computeDiscountedPrice(value, discountPercent));
    };

    const handleDiscountChange = (e) => {
        const value = e.target.value;
        setDiscountPercent(value);
        setDiscountedPrice(computeDiscountedPrice(originalPrice, value));
    };

    const computeDiscountedPrice = (price, discount) => {
        const floatPrice = parseFloat(price) || 0;
        const floatDiscount = parseFloat(discount) || 0;
        const finalPrice = floatPrice * (1 - (floatDiscount / 100))
        return finalPrice.toFixed(2);
    } 

    if(itemsId){
        formUrl = "/api/items/update/" + itemsId;
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categories_id: data.children.item_details && data.children.item_details.categories_id ? data.children.item_details.categories_id : "",
            items_code: data.children.item_details && data.children.item_details.items_code ? data.children.item_details.items_code : "",
            items_name: data.children.item_details && data.children.item_details.items_name ? data.children.item_details.items_name : "",
            items_price: originalPrice, 
            items_discount_rate: discountPercent, 
            items_discounted_price : discountedPrice, 
            items_image : files
        },
    })
    const onSubmit = async (formData) => {
        // formData.append("items_image", file);
        //console.log(formData);
        axios.post(formUrl, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        .then(response => {
            var message = response.data.message;
            if(message !== 'undefined'){
                // alert(message);
                // window.location.reload();
                setOpen(true)
                var message = response.data.message;
                setResultDialogContent({
                    title: "Result",
                    description: message, 
                    onAction : () => {
                        window.location.reload()
                    }
                });
            }
            
        })
        .catch(error => {
            if (error.response && error.response.data) {
                let errorStatus = "";
                if(error.response.status){
                    errorStatus = error.response.status;
                }
                switch(errorStatus){
                    case 500:
                        let errorMessage = error.response.statusText;
                        setOpen(true)
                        setResultDialogContent({
                            title: "Error",
                            description: errorMessage, 
                            onAction : () => {
                                console.log(error.response.data)
                            }
                        }); 
                    break;
                    default:
                        const serverErrors = error.response.data.errors;
                        Object.keys(serverErrors).forEach((field) => {
                            form.setError(field, {
                                type: "server", // Custom type to distinguish server errors
                                message: serverErrors[field],
                            });
                        });
                    break;
                }
                
                // Assuming your API returns errors in a format like:
                
            }
        });
    };

    return (
        <Form {...form}>
            <DisplayAlertMessage 
                title={resultDialogContent.title}
                description={resultDialogContent.description} 
                display_status={open} 
                onOpenChange={setOpen} />
            <h1>Item Form</h1>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                    <FormField 
                        control={form.control}
                        name="categories_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category Code</FormLabel>
                                <FormControl>
                                    <Select 
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent >
                                            <SelectItem value="0">Please select a category</SelectItem>
                                            {data.children.categories.map((item, index) => (
                                                <SelectItem key={item.id} value={item.id.toString()} >{item.categories_name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription>
                                    This is the category.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="items_code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Item Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="code" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is the item code.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="items_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Item Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is the item name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="space-y-6">
                    <FormField 
                        control={form.control}
                        name="items_image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Items Image</FormLabel>
                                <FormControl>
                                    <Dropzone
                                        accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
                                        // onDrop={(acceptedFiles) => {
                                        //     console.log(field);
                                        //     console.log(acceptedFiles);
                                        //     const file = acceptedFiles[0];
                                        //     if (file) {
                                        //         field.onChange(file); // update RHF state
                                        //         setFilePreview(URL.createObjectURL(file)); // for preview
                                        //     }
                                        // }}
                                        onDrop={handleDrop(field.onChange)}
                                        onError={console.error}
                                        src={filePreview} 
                                        multiple={false} 
                                    >
                                        <DropzoneEmptyState />
                                        <DropzoneContent>
                                            {filePreview && (
                                                <div className="h-[102px] w-full">
                                                    <img
                                                    alt="Preview"
                                                    className="absolute top-0 left-0 h-full w-full object-cover"
                                                    src={filePreview}
                                                    />
                                                </div>
                                            )}
                                        </DropzoneContent>
                                    </Dropzone>
                                </FormControl>
                                <FormDescription>
                                    This is the item's image.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}

                    />
                    
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium">Price Details</h3>
                        <p className="text-sm text-muted-foreground">Please provide the pricing details</p>
                    </div>
                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="items_price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <div className="w-full relative">
                                            <Label className ="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" htmlFor="items_price">PHP</Label>
                                            <Input 
                                                placeholder="Price" 
                                                className="pl-10" {...field} 
                                                onKeyUp={handlePriceChange}

                                            />
                                        </div>
                                        
                                    </FormControl>
                                    <FormDescription>
                                        This is the item's price.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="items_discount_rate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount Rate</FormLabel>
                                    <FormControl>
                                        <div className="w-full relative">
                                            <Label className ="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" htmlFor="items_discount_rate">%</Label>
                                            <Input 
                                                placeholder="Discount Rate" 
                                                className="pl-7" {...field} 
                                                onKeyUp={handleDiscountChange}
                                                />
                                        </div>
                                        
                                    </FormControl>
                                    <FormDescription>
                                        This is the item' discount rate.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="items_discounted_price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discounted Price</FormLabel>
                                    <FormControl>
                                        <div className="w-full relative">
                                            <Label className ="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" htmlFor="items_price">PHP</Label>
                                            <Input 
                                                disabled placeholder="Final Price" 
                                                className="pl-10" {...field} 
                                                value={discountedPrice}
                                            />
                                        </div>
                                        
                                    </FormControl>
                                    <FormDescription>
                                        This is the item's final price after discount.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <Button type="submit" className="mr-2">Submit</Button> 
                <Button variant="destructive" asChild>
                    <Link href="/items">Back</Link>
                </Button>
            </form>
        </Form>
    );
}