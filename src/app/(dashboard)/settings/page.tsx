"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const [name, setName] = useState(session?.user?.name || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, currentPassword, newPassword }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage("Profile updated successfully!")
        await update({ name: data.user.name })
        setCurrentPassword("")
        setNewPassword("")
      } else {
        setMessage(data.error || "Something went wrong")
      }
    } catch {
      setMessage("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h3 className="font-semibold">Profile</h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input type="email" value={session?.user?.email || ""} disabled className="mt-1 w-full rounded-lg border bg-muted px-3 py-2 text-sm text-muted-foreground" />
          </div>
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium">Change Password</h4>
            <div className="mt-3 space-y-3">
              <input type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" />
              <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          {message && <p className={`text-sm ${message.includes("success") ? "text-green-500" : "text-red-500"}`}>{message}</p>}
          <button type="submit" disabled={loading} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">{loading ? "Saving..." : "Save Changes"}</button>
        </form>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h3 className="font-semibold">Subscription</h3>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium capitalize">{session?.user?.plan || "Free"} Plan</p>
            <p className="text-xs text-muted-foreground">{session?.user?.plan === "pro" ? "You have access to all features" : "Upgrade to unlock all features"}</p>
          </div>
          {session?.user?.plan !== "pro" && <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Upgrade</button>}
        </div>
      </div>
    </div>
  )
}
