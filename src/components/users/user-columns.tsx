"use client"
import { ColumnDef } from "@tanstack/react-table"
import { type RouterOutputs } from "@/trpc/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { UserActions } from "./user-actions"

type User = RouterOutputs["user"]["getAll"][0]

export const columns: ColumnDef<User>[] = [
  {
    header: "User",
    accessorKey: "name",
    cell: ({ row }) => {
      const name = row.getValue("name") as string
      const email = row.original.email
      const image = row.original.image

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={image ?? undefined} alt={name ?? "Avatar"} />
            <AvatarFallback>
              {name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{name}</span>
            <span className="text-sm text-muted-foreground">{email}</span>
          </div>
        </div>
      )
    },
  },
  {
    header: "Role",
    accessorKey: "role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      return (
        <Badge
          className="text-[10px] font-medium"
          variant={role === "ADMIN" ? "destructive" : "secondary"}
        >
          {role}
        </Badge>
      )
    },
  },
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <UserActions user={row.original} />
    },
  },
]
