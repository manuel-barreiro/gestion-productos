import { ColumnDef, FilterFn, Row } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button"
import { Ellipsis, Eye, Pencil, Trash } from "lucide-react"
import { type RouterOutputs } from "@/trpc/react"
import { ProductDialog } from "../products/product-dialog"
import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import Link from "next/link"

type Product = RouterOutputs["product"]["getProducts"][0]

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date)
}

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
    header: "QR Code",
    id: "qrcode",
    cell: ({ row }) => (
      <Link href={`/product/${row.getValue("id")}`}>
        <div className="inline-block rounded-md bg-white p-1">
          <QRCodeSVG
            value={`${window.location.origin}/product/${row.getValue("id")}`}
            size={60}
            bgColor="#FFFFFF"
            fgColor="#000000"
          />
        </div>
      </Link>
    ),
    size: 60,
    enableHiding: true,
    enableSorting: false,
  },
  {
    header: "Created",
    accessorKey: "createdAt",
    cell: ({ row }) => (
      <div className="font-medium">{formatDate(row.getValue("createdAt"))}</div>
    ),
    size: 60,
    enableHiding: true,
  },
  {
    header: "Updated",
    accessorKey: "updatedAt",
    cell: ({ row }) => (
      <div className="font-medium">{formatDate(row.getValue("updatedAt"))}</div>
    ),
    size: 60,
    enableHiding: true,
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
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<"view" | "edit" | "delete">("view")

  const handleAction = (actionMode: "view" | "edit" | "delete") => {
    setMode(actionMode)
    setOpen(true)
  }

  return (
    <>
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
          <DropdownMenuItem
            className="flex justify-between"
            onSelect={() => handleAction("view")}
          >
            <span>View</span>
            <Eye size={16} strokeWidth={2} />
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex justify-between"
            onSelect={() => handleAction("edit")}
          >
            <span>Edit</span>
            <Pencil size={16} strokeWidth={2} />
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex justify-between text-destructive focus:text-destructive"
            onSelect={() => handleAction("delete")}
          >
            <span>Delete</span>
            <Trash size={16} strokeWidth={2} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProductDialog
        product={row.original}
        mode={mode}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
