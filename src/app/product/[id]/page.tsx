import { api } from "@/trpc/server"
import { notFound } from "next/navigation"
import { QRCodeSVG } from "qrcode.react"
import { Navbar } from "@/components/NavBar"
import { auth } from "@/server/auth"

export default async function ProductPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()
  const product = await api.product.getById({ id: Number(params.id) })

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Navbar session={session} />
      <main className="container mx-auto mt-8 max-w-2xl p-4">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground">Ingredients:</p>
                <p>{product.ingredients}</p>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground">Created:</p>
                <p>{new Date(product.createdAt).toLocaleString()}</p>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground">Last Updated:</p>
                <p>{new Date(product.updatedAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex justify-center">
              <QRCodeSVG
                value={`${process.env.NEXT_PUBLIC_APP_URL}/product/${product.id}`}
                size={200}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
