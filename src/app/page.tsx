import Link from "next/link"

import { LatestProduct } from "@/components/product"
import { auth } from "@/server/auth"
import { api, HydrateClient } from "@/trpc/server"
import DataTable from "@/components/table/data-table"

export default async function Home() {
  const products = await api.product.getProducts()
  const hello = await api.product.hello({ text: "from tRPC" })
  const session = await auth()

  if (session?.user) {
    void api.product.getLatest.prefetch()
  }

  return (
    <HydrateClient>
      <main className="container mx-auto">
        <DataTable products={products} />

        {session?.user && <LatestProduct />}
      </main>
    </HydrateClient>
  )
}
