
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import CategoriesList from '@/includes/pages/categories/categories-list';
import CategoriesForm from '@/includes/pages/categories/categories-form';
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Category',
        href: '/categories',
    },
];

export default function Category({ data, page }) {
    if(page == "list"){
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Category" />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                    <CategoriesList>{data}</CategoriesList>
                </div>
            </AppLayout>
        );
    }
    else{
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Category" />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                    <CategoriesForm>{data}</CategoriesForm>
                </div>
            </AppLayout>
        );
    }
    
}
