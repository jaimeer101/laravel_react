import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {Link } from '@inertiajs/react';
import { ArrowUpDown } from "lucide-react"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Items = {
    no: number
	id: number
	category: string
	code: string
	name: string
}

export const columns: ColumnDef<Items>[] = [
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
        "accessorKey" : "category", 
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Category
					<ArrowUpDown />
				</Button>
			)
		},
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
        "accessorKey" : "price", 
        header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Price
					<ArrowUpDown />
				</Button>
			)
		}, 
    },
    {
        "accessorKey" : "discounted_rate", 
        header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Discount
					<ArrowUpDown />
				</Button>
			)
		},
    },
    {
        "accessorKey": "discounted_price",
        header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Discounted Price
					<ArrowUpDown />
				</Button>
			)
		},
    },
    {
        "header" : "Actions", 
        cell: ({ row }) => (
            <Button asChild className="mr-2">
                <Link href={`/items/show/${row.original.id}`}>Edit</Link>
            </Button>
        )
    }
]