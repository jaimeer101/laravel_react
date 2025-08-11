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

export default function ItemsList(data) {
    const [open, setOpen] = React.useState(false);
    const deleteItem = (id) => {
        // const deleteConfirm = confirm("Are you sure you want to delete this item?");
        //if(deleteConfirm){
            axios.get("/api/items/delete/" + id)
                .then(response => {
                    setOpen(true)
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
                        setResultDialogContent({
                            title: "Error",
                            description: serverErrors, 
                            onAction : () => {
                                window.location.reload()
                            }
                        });
                    }
                });
        //}
        
    };
    const [dialogContent, setDialogContent] = useState({
        title: "Are you absolutely sure?",
        description: "This action cannot be undone. This will permanently delete the item and remove your data from our servers.", 
    });

    const [resultDialogContent, setResultDialogContent] = useState({
        title: "Result",
        description: "This is a sample", 
        onAction: () => {
            setOpen(false)
        },
    });

    return (
        <div>
            <div>
                <Button asChild>
                    <Link href="/items/create">Add Item</Link>
                </Button>
            </div>
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
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Id</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.children.map((item, index) => (
                        <TableRow key={item.id}>
                            <TableCell  className="font-medium">{index + 1}</TableCell>
                            <TableCell >{item.categories.categories_name}</TableCell>
                            <TableCell >{item.items_code}</TableCell>
                            <TableCell >{item.items_name}</TableCell>
                            <TableCell >
                                <Button asChild className="mr-2">
                                    <Link href={`/items/show/${item.id}`}>Edit</Link>
                                </Button>

                                {/* <Button variant="destructive" onClick={() => deleteItem(item.id)}>Delete</Button> */}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive">Delete</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>{dialogContent.title}</AlertDialogTitle>
                                            <AlertDialogDescription>{dialogContent.description}</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => deleteItem(item.id)}>Continue</AlertDialogAction>
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
