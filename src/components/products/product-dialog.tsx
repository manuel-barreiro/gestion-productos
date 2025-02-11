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
import { MinimalTiptapEditor } from "../minimal-tiptap"
import { cn } from "@/lib/utils"
import { LoaderCircle } from "lucide-react"
import { useEffect } from "react"

type Product = RouterOutputs["product"]["getProducts"][0]

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  ingredients: z.string().min(1, "Ingredients are required"),
})

type FormValues = z.infer<typeof formSchema>

type Mode = "create" | "edit" | "delete"

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
  const isDeleteMode = mode === "delete"
  const isCreateMode = mode === "create"

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name ?? "",
      ingredients: product?.ingredients ?? "",
    },
  })

  // Reset form when product changes
  useEffect(() => {
    form.reset({
      name: product?.name ?? "",
      ingredients: product?.ingredients ?? "",
    })
  }, [product, form])

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
      router.push("/")
    },
  })

  function onSubmit(data: FormValues) {
    if (isCreateMode) {
      createProduct.mutate(data)
    } else {
      updateProduct.mutate({ id: product!.id, data })
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
      <DialogContent className="overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isDeleteMode
              ? `Delete ${product?.name}`
              : isCreateMode
                ? "Create new product"
                : "Edit product"}
          </DialogTitle>
          <DialogDescription>
            {isDeleteMode
              ? "This action cannot be undone."
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
              {deleteProduct.isPending ? (
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
                      <Input {...field} placeholder="Product name" />
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
                      <MinimalTiptapEditor
                        {...field}
                        throttleDelay={0}
                        className={cn("", {
                          "border-destructive focus-within:border-destructive":
                            form.formState.errors.ingredients,
                        })}
                        editorContentClassName="overflow-auto h-full flex grow"
                        output="html"
                        placeholder="Type your description here..."
                        editable={true}
                        editorClassName="focus:outline-none px-5 py-4 h-full grow"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset()
                    onOpenChange(false)
                  }}
                  disabled={!isDirty || isPending}
                >
                  Discard
                </Button>
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
                    "Create product"
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
