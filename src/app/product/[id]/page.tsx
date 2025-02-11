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

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  const session = await auth()
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
    <div className="min-h-screen">
      <Navbar session={session} />
      <main className="container mx-auto max-w-3xl p-4">
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">
                {product.name}
              </CardTitle>
              <ProductActions product={product} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 md:grid-cols-5">
              {/* Main Content - Takes up 3 columns */}
              <div className="space-y-6 md:col-span-3">
                <div className="rounded-lg bg-gray-50 p-4">
                  <SafeHTMLRenderer htmlContent={product.ingredients} />
                </div>
              </div>

              {/* QR Code Section - Takes up 2 columns */}
              <div className="md:col-span-2">
                <div className="flex flex-col items-center space-y-4">
                  <div className="rounded-xl bg-white p-4 shadow-sm">
                    <QRCodeSVG
                      value={`${process.env.NEXT_PUBLIC_APP_URL}/product/${product.id}`}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata Footer */}
            <div className="mt-8">
              <Separator className="mb-4" />
              <div className="grid gap-4 text-sm text-muted-foreground md:grid-cols-3">
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
    </div>
  )
}
