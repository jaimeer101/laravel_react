import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import ItemsList from '@/includes/pages/items/items-list';
import ItemsForm from '@/includes/pages/items/items-form';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Items',
        href: '/items',
    },
];

export default function Item({ data, page, title }) {
    let display, showTitle;
    showTitle = title ? title : "Items"
    if(page == "list"){
        display = <ItemsList>{data}</ItemsList>
    }
    else{
        display = <ItemsForm>{data}</ItemsForm>
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <Head title={showTitle} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                {display}
            </div>
        </AppLayout>
    );
}