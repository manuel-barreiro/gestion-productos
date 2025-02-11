"use client"
import { useSession } from "next-auth/react"

export function useAuth() {
  const { data: session } = useSession()

  const isAdmin = session?.user?.role === "ADMIN"
  const isAuthenticated = !!session?.user

  return {
    isAdmin,
    isAuthenticated,
    user: session?.user,
    role: session?.user?.role,
  }
}
