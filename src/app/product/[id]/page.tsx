import { api } from "@/trpc/server"
import { notFound } from "next/navigation"
import { QRCodeSVG } from "qrcode.react"
import { Navbar } from "@/components/NavBar"
import { auth } from "@/server/auth"
import { SafeHTMLRenderer } from "@/components/safe-html-renderer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ProductActions } from "@/components/products/product-actions"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { QRCode } from "@/components/products/qr-code"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  const product = await api.product.getById({ id: Number(id) })

  if (!product) {
    notFound()
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    })
  }

  return (
    <main className="container mx-auto max-w-5xl p-4">
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
            <ProductActions product={product} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-5">
            {/* Main Content - Takes up 3 columns */}
            <div className="space-y-6 md:col-span-3">
              <div className="rounded-lg">
                <SafeHTMLRenderer htmlContent={product.ingredients} />
              </div>
            </div>

            {/* QR Code Section - Takes up 2 columns */}
            <div className="md:col-span-2">
              <div className="flex flex-col items-center space-y-4">
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <QRCode path={`/product/${product.id}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Metadata Footer */}
          <div className="mt-8">
            <Separator className="mb-4" />
            <div className="flex flex-col justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
              <div>
                <p className="font-medium">Created</p>
                <p>{formatDate(product.createdAt)}</p>
              </div>
              <div>
                <p className="font-medium">Last Updated</p>
                <p>{formatDate(product.updatedAt)}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-medium">Created by</p>
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger>
                      <Avatar>
                        <AvatarFallback>
                          {product.createdBy.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase() ?? "?"}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{product.createdBy.name ?? "Unknown user"}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
