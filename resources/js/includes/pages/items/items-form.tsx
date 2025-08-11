import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {Link } from '@inertiajs/react';
import axios from 'axios';
import React, { useState, useRef } from 'react'; 

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
    items_price: z.coerce.number().gt(0, {
        message: "Price must be greater than 0",
    }),
    items_discount_rate: z.coerce.number().min(0, {
        message: "Must be a positive number"
    }), 
    items_discounted_price: z.coerce.number(),
})

export default function ItemsForm(data) {
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
        },
    })

    const onSubmit = async (formData) => {
        axios.post(formUrl, formData)
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
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{resultDialogContent.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {resultDialogContent.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={resultDialogContent.onAction}>
                            Ok
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <h1>Item Form</h1>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                                    <SelectTrigger className="w-[180px]">
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
                <Button type="submit" className="mr-2">Submit</Button> 
                <Button variant="destructive" asChild>
                    <Link href="/items">Back</Link>
                </Button>
            </form>
        </Form>
    );
}