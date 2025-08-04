"use client"
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {Link } from '@inertiajs/react';
import axios from 'axios';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
    category_code: z.string().min(2, {
        message: "Code must be at least 2 characters.",
    }),
    category_name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
})

export default function CategoriesForm(data) {
    const [open, setOpen] = React.useState(false);
    const [resultDialogContent, setResultDialogContent] = useState({
        title: "Result",
        description: "This is a sample", 
        onAction: () => {
            setOpen(false)
        },
    });
    let categoryId = data.children.id;
    let formUrl = "/api/categories/store";

    
    if(categoryId){
        formUrl = "/api/categories/update/" + categoryId;
    }
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category_code: data.children.categories_code ? data.children.categories_code : "",
            category_name: data.children.categories_name ? data.children.categories_name : "",
        },
    })

    const onSubmit = async (formData) => {
        axios.post(formUrl, formData)
            .then(response => {
                var message = response.data.message;
                setOpen(true);
                var message = response.data.message;
                setResultDialogContent({
                    title: "Result",
                    description: message, 
                    onAction : () => {
                        window.location.reload()
                    }
                });
                // alert(message);
                // window.location.reload();
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.errors) {
                    // Assuming your API returns errors in a format like:
                    const serverErrors = error.response.data.errors;
                    Object.keys(serverErrors).forEach((field) => {
                        form.setError(field, {
                            type: "server", // Custom type to distinguish server errors
                            message: serverErrors[field],
                        });
                    });
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
                <h1>Category Form</h1>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="category_code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="code" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is the category code.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* {errors.category_code && <p style={{ color: 'red' }}>{errors.category_code}</p>} */}
                    <FormField
                        control={form.control}
                        name="category_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is the category name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="mr-2">Submit</Button> 
                    <Button variant="destructive" asChild>
                        <Link href="/categories">Back</Link>
                    </Button>
                </form>
            </Form>
        );
}