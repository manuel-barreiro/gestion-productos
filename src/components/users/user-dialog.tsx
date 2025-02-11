"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { api } from "@/trpc/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { type RouterOutputs } from "@/trpc/react"
import { LoaderCircle } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/hooks/use-toast"

type User = RouterOutputs["user"]["getAll"][0]

const createFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["USER", "ADMIN"]),
})

const editFormSchema = createFormSchema.omit({ password: true }).partial()

type CreateFormValues = z.infer<typeof createFormSchema>
type EditFormValues = z.infer<typeof editFormSchema>

type Mode = "create" | "edit" | "delete"

interface UserDialogProps {
  user?: User
  mode: Mode
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserDialog({
  user,
  mode,
  open,
  onOpenChange,
}: UserDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const isDeleteMode = mode === "delete"
  const isCreateMode = mode === "create"

  const form = useForm<CreateFormValues | EditFormValues>({
    resolver: zodResolver(isCreateMode ? createFormSchema : editFormSchema),
    values: isCreateMode
      ? {
          name: "",
          email: "",
          password: "",
          role: "USER",
        }
      : {
          name: user?.name ?? "",
          email: user?.email ?? "",
          role: (user?.role ?? "USER") as "ADMIN" | "USER",
        },
  })

  const { isDirty } = form.formState

  const createUser = api.user.create.useMutation({
    onSuccess: () => {
      onOpenChange(false)
      form.reset()
      router.refresh()
      toast({
        title: "Success",
        description: "User created successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const updateUser = api.user.update.useMutation({
    onSuccess: () => {
      onOpenChange(false)
      form.reset()
      router.refresh()
      toast({
        title: "Success",
        description: "User updated successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const deleteUser = api.user.delete.useMutation({
    onSuccess: () => {
      onOpenChange(false)
      router.refresh()
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  function onSubmit(data: CreateFormValues | EditFormValues) {
    if (isCreateMode) {
      createUser.mutate(data as CreateFormValues)
    } else {
      updateUser.mutate({ id: user!.id, ...data })
    }
  }

  const isPending =
    createUser.isPending || updateUser.isPending || deleteUser.isPending

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (isPending) return
        if (!isOpen) {
          form.reset()
        }
        onOpenChange(isOpen)
      }}
    >
      <DialogContent className="overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isDeleteMode
              ? `Delete ${user?.name}`
              : isCreateMode
                ? "Create new user"
                : "Edit user"}
          </DialogTitle>
          <DialogDescription>
            {isDeleteMode
              ? "This action cannot be undone."
              : isCreateMode
                ? "Add a new user to the system"
                : "Make changes to this user"}
          </DialogDescription>
        </DialogHeader>

        {isDeleteMode ? (
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              disabled={deleteUser.isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteUser.isPending}
              onClick={() => deleteUser.mutate({ id: user!.id })}
            >
              {deleteUser.isPending ? (
                <div className="flex items-center gap-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Deleting...
                </div>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="User name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Email address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isCreateMode && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Enter password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USER">User</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={(!isDirty && !isCreateMode) || isPending}
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      {isCreateMode ? "Creating..." : "Saving..."}
                    </div>
                  ) : isCreateMode ? (
                    "Create user"
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
