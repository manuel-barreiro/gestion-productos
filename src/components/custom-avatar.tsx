"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ChevronDown, LogOut, User } from "lucide-react"
import { Session } from "next-auth"
import { Badge } from "@/components/ui/badge"
import { Authorize } from "@/components/authorize"

export default function CustomAvatar({ session }: { session: Session | null }) {
  const router = useRouter()
  const handleSignOut = async () => {
    await signOut({
      redirectTo: "/sign-in",
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage src={session?.user.image ?? ""} />
            <AvatarFallback>
              {session?.user.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <ChevronDown
            size={16}
            strokeWidth={2}
            className="ms-2 opacity-60"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-medium text-foreground">
              {session?.user.name}
            </span>
            <Authorize roles={["ADMIN"]}>
              <Badge variant="secondary" className="text-[10px] font-medium">
                ADMIN
              </Badge>
            </Authorize>
          </div>
          <span className="truncate text-xs font-normal text-muted-foreground">
            {session?.user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Authorize roles={["ADMIN"]}>
          <DropdownMenuItem onClick={() => router.push("/users")}>
            <User
              size={16}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
            <span>Users</span>
          </DropdownMenuItem>
        </Authorize>
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut
            size={16}
            strokeWidth={2}
            className="opacity-60"
            aria-hidden="true"
          />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
