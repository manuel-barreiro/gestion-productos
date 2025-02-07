"use client"

import { useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
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
import { cn } from "@/lib/utils"

type Product = RouterOutputs["product"]["getProducts"][0]

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  ingredients: z.string().min(1, "Ingredients are required"),
})

type FormValues = z.infer<typeof formSchema>

type Mode = "create" | "view" | "edit" | "delete"

interface ProductDialogProps {
  product?: Product // Make product optional since create mode won't have one
  mode: Mode
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductDialog({
  product,
  mode,
  open,
  onOpenChange,
}: ProductDialogProps) {
  const router = useRouter()
  const isViewMode = mode === "view"
  const isDeleteMode = mode === "delete"
  const isCreateMode = mode === "create"

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    values: {
      // Use values instead of defaultValues
      name: product?.name ?? "",
      ingredients: product?.ingredients ?? "",
    },
  })

  const { isDirty } = form.formState

  const createProduct = api.product.create.useMutation({
    onSuccess: () => {
      onOpenChange(false)
      form.reset()
      router.refresh()
    },
  })

  const updateProduct = api.product.update.useMutation({
    onSuccess: () => {
      onOpenChange(false)
      form.reset()
      router.refresh()
    },
  })

  const deleteProduct = api.product.delete.useMutation({
    onSuccess: () => {
      onOpenChange(false)
      router.refresh()
    },
  })

  function onSubmit(data: FormValues) {
    if (isViewMode) return
    if (isCreateMode) {
      createProduct.mutate(data)
    } else {
      updateProduct.mutate({ id: product!.id, ...data })
    }
  }

  const isPending =
    createProduct.isPending ||
    updateProduct.isPending ||
    deleteProduct.isPending

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (isPending) return
        onOpenChange(isOpen)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isDeleteMode
              ? `Delete ${product?.name}`
              : isViewMode
                ? "View product"
                : isCreateMode
                  ? "Create new product"
                  : "Edit product"}
          </DialogTitle>
          <DialogDescription>
            {isDeleteMode
              ? "This action cannot be undone."
              : isViewMode
                ? "Product details"
                : isCreateMode
                  ? "Add a new product to your inventory"
                  : "Make changes to this product"}
          </DialogDescription>
        </DialogHeader>

        {isDeleteMode ? (
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              disabled={deleteProduct.isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteProduct.isPending}
              onClick={() => deleteProduct.mutate({ id: product!.id })}
            >
              {deleteProduct.isPending ? "Deleting..." : "Delete"}
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
                      <Input
                        {...field}
                        placeholder="Product name"
                        disabled={isViewMode}
                        readOnly={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ingredients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ingredients</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="List the ingredients..."
                        disabled={isViewMode}
                        readOnly={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isViewMode && (
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={(!isDirty && !isCreateMode) || isPending}
                  >
                    {isPending
                      ? isCreateMode
                        ? "Creating..."
                        : "Saving..."
                      : isCreateMode
                        ? "Create product"
                        : "Save changes"}
                  </Button>
                </DialogFooter>
              )}
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
