"use client"
import { ColumnDef, FilterFn, Row } from "@tanstack/react-table"
import { Eye } from "lucide-react"
import { type RouterOutputs } from "@/trpc/react"
import Link from "next/link"
import { QRCode } from "./qr-code"

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
      <Link
        href={`/product/${row.getValue("id")}`}
        className="group flex items-center gap-2 font-medium transition-all duration-200 hover:text-blue-500"
      >
        <span className="border-b border-transparent hover:border-blue-500">
          {row.getValue("name")}
        </span>
      </Link>
    ),
    size: 100,
    filterFn: nameColumnFilterFn,
    enableHiding: false,
  },
  // {
  //   header: "Ingredients",
  //   accessorKey: "ingredients",
  //   cell: ({ row }) => (
  //     <SafeHTMLRenderer htmlContent={row.getValue("ingredients")} />
  //   ),
  //   size: 100,
  //   enableHiding: false,
  //   enableSorting: false,
  // },
  {
    header: "QR Code",
    id: "qrcode",
    cell: ({ row }) => (
      <div className="inline-block rounded-md bg-white p-1">
        <QRCode
          path={`/product/${row.getValue("id")}`}
          size={80}
          showActions={false}
          containerClassName="bg-transparent p-0 border-0 shadow-none"
        />
      </div>
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
]
