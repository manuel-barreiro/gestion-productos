import { api, HydrateClient } from "@/trpc/server"
import ProductsTable from "@/components/products/products-table"

export default async function ProductsPage() {
  const products = await api.product.getProducts()

  return (
    <HydrateClient>
      <main className="flex items-center justify-center p-4">
        <ProductsTable products={products} />
      </main>
    </HydrateClient>
  )
}
