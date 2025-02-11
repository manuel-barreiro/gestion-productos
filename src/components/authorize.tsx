import { type ReactNode } from "react"
import { useAuth } from "@/hooks/use-auth"

interface AuthorizeProps {
  children: ReactNode
  roles?: ("ADMIN" | "USER")[]
  fallback?: ReactNode
}

export function Authorize({
  children,
  roles,
  fallback = null,
}: AuthorizeProps) {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) return fallback

  if (roles && !roles.includes(role as "ADMIN" | "USER")) {
    return fallback
  }

  return <>{children}</>
}
