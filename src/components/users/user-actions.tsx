"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Ellipsis, Pencil, Trash } from "lucide-react"
import { UserDialog } from "./user-dialog"
import { useState } from "react"
import { type RouterOutputs } from "@/trpc/react"
import { Authorize } from "@/components/authorize"

type User = RouterOutputs["user"]["getAll"][0]

export function UserActions({ user }: { user: User }) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<"edit" | "delete">("edit")

  const handleAction = (actionMode: "edit" | "delete") => {
    setMode(actionMode)
    setOpen(true)
  }

  return (
    <Authorize roles={["ADMIN"]}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-end">
            <Button
              size="icon"
              variant="ghost"
              className="shadow-none"
              aria-label="Edit user"
            >
              <Ellipsis size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
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

      <UserDialog user={user} mode={mode} open={open} onOpenChange={setOpen} />
    </Authorize>
  )
}
