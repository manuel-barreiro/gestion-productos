"use client"

import DataTable from "@/components/table/data-table"
import { ProductDialog } from "@/components/products/product-dialog"
import { columns } from "@/components/products/product-columns"
import { useState } from "react"
import { RouterOutputs } from "@/trpc/react"

type Product = RouterOutputs["product"]["getProducts"][0]

interface ProductsTableProps {
  products: Product[]
}

export default function ProductsTable({ products }: ProductsTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  return (
    <>
      <DataTable
        data={products}
        columns={columns}
        newButtonText="New product"
        onNewClick={() => setDialogOpen(true)}
      />
      <ProductDialog
        mode={"create"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}
