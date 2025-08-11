import React, { useState } from 'react';
import {Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";

import { columns, Items } from "./items-list-columns"
import { DataTable } from "./items-list-data_tables"


export default function ItemsList(data) {
    const data2: Items[] = data.children

    return (
        <div>
            <div>
                <Button asChild>
                    <Link href="/items/create">Add Item</Link>
                </Button>
            </div>
            
            <DataTable columns={columns} data={data2} />
            
        </div>
    );
}
