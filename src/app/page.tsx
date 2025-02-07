import Link from "next/link"

import { LatestProduct } from "@/components/product"
import { auth } from "@/server/auth"
import { api, HydrateClient } from "@/trpc/server"
import DataTable from "@/components/table/data-table"
import { Navbar } from "@/components/NavBar"

export default async function Home() {
  const products = await api.product.getProducts()
  const session = await auth()

  if (session?.user) {
    void api.product.getLatest.prefetch()
  }

  return (
    <HydrateClient>
      <div className="min-h-screen">
        <Navbar session={session} />
        <main className="flex items-center justify-center p-4">
          <DataTable products={products} />
        </main>
      </div>
    </HydrateClient>
  )
}
