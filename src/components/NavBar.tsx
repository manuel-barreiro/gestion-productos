"use client"

import CustomAvatar from "./custom-avatar"
import { useSession } from "next-auth/react" // Add this
import ToggleTheme from "./theme/theme-toggle"
import Link from "next/link"

export function Navbar() {
  const { data: session } = useSession() // Add this

  return (
    <nav className="mx-auto max-w-5xl border-b border-gray-200">
      <div className="flex h-16 items-center px-4 sm:px-0">
        <div className="flex flex-1 items-center justify-between">
          <Link href={"/"} className="font-semibold">
            gestion-productos
          </Link>
          <div className="flex items-center gap-4">
            <ToggleTheme />
            {session?.user && <CustomAvatar session={session} />}
          </div>
        </div>
      </div>
    </nav>
  )
}
