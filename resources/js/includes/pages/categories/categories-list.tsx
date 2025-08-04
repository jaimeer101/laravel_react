import React, { useState } from 'react';
import {Link } from '@inertiajs/react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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

export default function CategoriesList(data) {
    const [open, setOpen] = React.useState(false);
    const [resultDialogContent, setResultDialogContent] = useState({
        title: "Result",
        description: "This is a sample", 
        onAction: () => {
            setOpen(false)
        },
    });
    const [dialogDeleteContent, setDialogDialogContent] = useState({
        title: "Are you absolutely sure?",
        description: "This action cannot be undone. This will permanently delete the category and remove your data from our servers.", 
    });
    const deleteCategory = (id) => {
        // const deleteConfirm = confirm("Are you sure you want to delete this category?");
        // if(deleteConfirm){
            axios.get("/api/categories/delete/" + id)
                .then(response => {
                    var message = response.data.message;
                    setOpen(true);
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
                        // { errors: { email: "Email already exists", password: "Too short" } }
                        const serverErrors = error.response.data.errors;
                        Object.keys(serverErrors).forEach((field) => {
                            form.setError(field, {
                                type: "server", // Custom type to distinguish server errors
                                message: serverErrors[field],
                            });
                        });
                    }
                });
        // }
        
    };

    return (
        <div>
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
            <div>
                <Button asChild>
                    <Link href="/categories/create">Add Category</Link>
                </Button>
            </div>
            
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Id</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.children.map((item, index) => (
                        <TableRow key={item.id}>
                            <TableCell  className="font-medium">{index + 1}</TableCell>
                            <TableCell >{item.categories_code}</TableCell>
                            <TableCell >{item.categories_name}</TableCell>
                            <TableCell >
                                <Button asChild className="mr-2">
                                    <Link href={`/categories/show/${item.id}`}>Edit</Link>
                                </Button>

                                {/* <Button variant="destructive" onClick={() => deleteCategory(item.id)}>Delete</Button> */}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive">Delete</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>{dialogDeleteContent.title}</AlertDialogTitle>
                                            <AlertDialogDescription>{dialogDeleteContent.description}</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => deleteCategory(item.id)}>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                        
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}