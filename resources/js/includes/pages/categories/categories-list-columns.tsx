import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {Link } from '@inertiajs/react';
import { ArrowUpDown } from "lucide-react"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Categories = {
    no: number
    id: number
    code: string
    name: string
}

export const columns: ColumnDef<Categories>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
            checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <Checkbox 
                id={"chk_" + row.original.id}
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                />  <Label htmlFor={"chk_" + row.original.id}>{row.original.no}</Label>
            </div> 
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        "accessorKey" : "code", 
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Code
                    <ArrowUpDown />
                </Button>
            )
        },
    },
    {
        "accessorKey" : "name", 
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown />
                </Button>
            )
        },
    },
    {
        "header" : "Actions", 
        cell: ({ row }) => (
            <Button asChild className="mr-2">
                <Link href={`/categories/show/${row.original.id}`}>Edit</Link>
            </Button>
        )
    }
]