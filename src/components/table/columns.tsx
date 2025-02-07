import { ColumnDef, FilterFn, Row } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button"
import { Ellipsis, Eye, Pencil, Trash } from "lucide-react"
import { type RouterOutputs } from "@/trpc/react"

type Product = RouterOutputs["product"]["getProducts"][0]

const nameColumnFilterFn: FilterFn<Product> = (row, columnId, filterValue) => {
  const searchableRowContent = `${row.original.name}`.toLowerCase()
  const searchTerm = (filterValue ?? "").toLowerCase()
  return searchableRowContent.includes(searchTerm)
}

export const columns: ColumnDef<Product>[] = [
  {
    header: "id",
    accessorKey: "id",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
    size: 10,
    enableHiding: false,
  },
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
    size: 60,
    filterFn: nameColumnFilterFn,
    enableHiding: false,
  },
  {
    header: "Ingredients",
    accessorKey: "ingredients",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("ingredients")}</div>
    ),
    size: 100,
    enableHiding: false,
    enableSorting: false,
  },

  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    size: 10,
    enableHiding: false,
  },
]

function RowActions({ row }: { row: Row<Product> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button
            size="icon"
            variant="ghost"
            className="shadow-none"
            aria-label="Edit item"
          >
            <Ellipsis size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="flex justify-between">
          <span>View</span>

          <Eye size={16} strokeWidth={2} />
        </DropdownMenuItem>

        <DropdownMenuItem className="flex justify-between">
          <span>Edit</span>

          <Pencil size={16} strokeWidth={2} />
        </DropdownMenuItem>

        <DropdownMenuItem className="flex justify-between text-destructive focus:text-destructive">
          <span>Delete</span>

          <Trash size={16} strokeWidth={2} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
