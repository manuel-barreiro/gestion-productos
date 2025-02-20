"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LoaderCircle } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const searchParams = useSearchParams()

  // Add useEffect to handle URL error parameter
  useEffect(() => {
    const error = searchParams.get("error")
    if (error === "CredentialsSignin") {
      setError("Invalid email or password")
    }
  }, [searchParams])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    setLoading(true)
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/",
      })
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your credentials to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              {error && <div className="text-sm text-red-500">{error}</div>}
              <Button disabled={loading} type="submit" className="w-full">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <LoaderCircle className="animate-spin" size={16} />
                    Signing you in...
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
