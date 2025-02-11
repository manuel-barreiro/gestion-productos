import { api, HydrateClient } from "@/trpc/server"
import UsersTable from "@/components/users/users-table"

export default async function UsersPage() {
  const users = await api.user.getAll()

  return (
    <HydrateClient>
      <main className="flex items-center justify-center p-4">
        <UsersTable users={users} />
      </main>
    </HydrateClient>
  )
}
