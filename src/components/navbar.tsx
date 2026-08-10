import { UserButton } from "./user-button"

export function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <h2 className="text-lg font-semibold">Overview</h2>
      <UserButton />
    </header>
  )
}
