"use client"

import { useState } from "react"
import { Plus, Users } from "lucide-react"

export default function TeamPage() {
  const [showInvite, setShowInvite] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team Members</h1>
          <p className="text-muted-foreground">Manage who has access to your workspace</p>
        </div>
        <button onClick={() => setShowInvite(true)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Invite Member
        </button>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-16">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No team members yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">Invite your team to start collaborating</p>
        <button onClick={() => setShowInvite(true)} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Invite Member
        </button>
      </div>

      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Invite Team Member</h2>
            <p className="mt-1 text-sm text-muted-foreground">Coming soon — full team management</p>
            <button onClick={() => setShowInvite(false)} className="mt-4 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
