"use client"

import { signOut, useSession } from "next-auth/react"
import { User, LogOut } from "lucide-react"

export function UserButton() {
  const { data: session } = useSession()

  return (
    <div className="flex items-center gap-3">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-medium">{session?.user?.name}</p>
        <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
      </div>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
        <User className="h-4 w-4 text-primary" />
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
        title="Sign out"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  )
}
