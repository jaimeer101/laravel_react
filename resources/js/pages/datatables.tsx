import * as React from "react"
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table" 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Datatables',
        href: '/datatables',
    },
];

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
        "header" : "Actions"
    }
]
export default function Datatables({ data2, page }) {
	console.log(data2);
    const data: Items[] = data2
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const table = useReactTable({
            data,
            columns,
            onSortingChange: setSorting,
            onColumnFiltersChange: setColumnFilters,
            getCoreRowModel: getCoreRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            getSortedRowModel: getSortedRowModel(),
            getFilteredRowModel: getFilteredRowModel(),
            onColumnVisibilityChange: setColumnVisibility,
            onRowSelectionChange: setRowSelection,
            state: {
                sorting,
                columnFilters,
                columnVisibility,
                rowSelection,
            },
    })
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Datatables" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="w-full">
					<div className="flex items-center py-4">
						<Input
							placeholder="Filter names..."
							value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
							onChange={(event) =>
								table.getColumn("name")?.setFilterValue(event.target.value)
							}
							className="max-w-sm"
						/>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" className="ml-auto">
									Columns <ChevronDown />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">{
								table
									.getAllColumns()
									.filter((column) => column.getCanHide())
									.map((column) => {
										return (
											<DropdownMenuCheckboxItem
												key={column.id}
												className="capitalize"
												checked={column.getIsVisible()}
												onCheckedChange={(value) =>
													column.toggleVisibility(!!value)
												}
												>
												{column.id}
											</DropdownMenuCheckboxItem>
										)
									})	
							}</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<div className="overflow-hidden rounded-md border">
						<Table>
							<TableHeader>{
								table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
											</TableHead>
										)
										})}
									</TableRow>
								))
							}</TableHeader>
							<TableBody>{
								table.getRowModel().rows?.length ? (
									table.getRowModel().rows.map((row) => (
										<TableRow
											key={row.id}
											data-state={row.getIsSelected() && "selected"}
										>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
											</TableCell>
										))}
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={columns.length}
											className="h-24 text-center">
											No results.
										</TableCell>
									</TableRow>
								)
							}</TableBody>
						</Table>
					</div>
					<div className="flex items-center justify-end space-x-2 py-4">
						<div className="text-muted-foreground flex-1 text-sm">
							{table.getFilteredSelectedRowModel().rows.length} of{" "}
							{table.getFilteredRowModel().rows.length} row(s) selected.
						</div>
						<div className="flex items-center space-x-6 lg:space-x-8">
							<div className="flex items-center space-x-2">
								<p className="text-sm font-medium">Rows per page</p>
								<Select
									value={`${table.getState().pagination.pageSize}`}
									onValueChange={(value) => {
										table.setPageSize(Number(value))
									}}
								>
									<SelectTrigger className="h-8 w-[70px]">
										<SelectValue placeholder={table.getState().pagination.pageSize} />
									</SelectTrigger>
									<SelectContent side="top">
										{[10, 20, 25, 30, 40, 50].map((pageSize) => (
										<SelectItem key={pageSize} value={`${pageSize}`}>
											{pageSize}
										</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="flex w-[100px] items-center justify-center text-sm font-medium">
								Page {table.getState().pagination.pageIndex + 1} of{" "}
								{table.getPageCount()}
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()} >
								Previous
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}>
								Next
							</Button>
						</div>
					</div>
				</div>
            </div>
        </AppLayout>
    );
}