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
import { columns, Categories } from './categories-list-columns';
import { DataTable } from "./categories-list-data_tables";

export default function CategoriesList(data) {
    const data2: Categories[] = data.children
    return (
        <div>
            <div>
                <Button asChild>
                    <Link href="/categories/create">Add Category</Link>
                </Button>
            </div>
            <DataTable columns={columns} data={data2} />
        </div>
    );
}