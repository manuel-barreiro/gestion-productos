import CustomAvatar from "./custom-avatar"
import { Session } from "next-auth"
import ToggleTheme from "./theme/theme-toggle"

export function Navbar({ session }: { session: Session | null }) {
  return (
    <nav className="container mx-auto lg:px-20 xl:px-24">
      <div className="flex h-16 items-center px-4">
        <div className="flex flex-1 items-center justify-between">
          <div className="font-semibold">gestion-productos</div>
          <div className="flex items-center gap-4">
            <ToggleTheme />
            {session?.user && <CustomAvatar session={session} />}
          </div>
        </div>
      </div>
    </nav>
  )
}
