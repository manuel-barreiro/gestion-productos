"use client"

import DataTable from "@/components/table/data-table"
import { ProductDialog } from "@/components/products/product-dialog"
import { columns } from "@/components/users/user-columns"
import { useState } from "react"
import { RouterOutputs } from "@/trpc/react"
import { UserDialog } from "./user-dialog"

type User = RouterOutputs["user"]["getAll"][0]

interface UsersTableProps {
  users: User[]
}

export default function UsersTable({ users }: UsersTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  return (
    <>
      <DataTable
        data={users}
        columns={columns}
        newButtonText="Add user"
        onNewClick={() => setDialogOpen(true)}
      />
      <UserDialog
        mode={"create"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}
