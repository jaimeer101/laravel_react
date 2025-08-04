import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {Link } from '@inertiajs/react';
import axios from 'axios';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
})

export default function ItemsForm(data) {
    console.log(data);
    let itemsId = data.children.item_details && data.children.item_details.id ? data.children.item_details.id : '';
    let formUrl = "/api/items/store";

    if(itemsId){
        formUrl = "/api/items/update/" + itemsId;
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categories_id: data.children.item_details && data.children.item_details.categories_id ? data.children.item_details.categories_id : "",
            items_code: data.children.item_details && data.children.item_details.items_code ? data.children.item_details.items_code : "",
            items_name: data.children.item_details && data.children.item_details.items_name ? data.children.item_details.items_name : "",
        },
    })

    const onSubmit = async (formData) => {
        axios.post(formUrl, formData)
            .then(response => {
                var message = response.data.message;
                if(message !== 'undefined'){
                    alert(message);
                    window.location.reload();
                }
                
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
                <Button type="submit" className="mr-2">Submit</Button> 
                <Button variant="destructive" asChild>
                    <Link href="/items">Back</Link>
                </Button>
            </form>
        </Form>
    );
}