export const dynamic = "force-dynamic"

export default async function StatusPage() {
  const res = await fetch("http://localhost:3000/api/status", { cache: "no-store" })
  const data = await res.json().catch(() => null)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <h1 className="text-xl font-bold">System Status</h1>
          <a href="/" className="text-sm text-primary hover:underline">Back to app</a>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-xl border bg-green-50 p-6 text-center">
          <h2 className="text-xl font-bold text-green-700">All Systems Operational</h2>
          <p className="text-sm text-muted-foreground">Last checked: {new Date().toLocaleTimeString()}</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.services?.map((s: any) => (
            <div key={s.id} className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold">{s.displayName}</h3>
              <p className="text-sm text-green-600 mt-1">Operational</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="rounded bg-green-50 p-2 text-center text-xs"><p className="text-muted-foreground">30d</p><p className="font-bold text-green-700">{s.uptime30d}%</p></div>
                <div className="rounded bg-green-50 p-2 text-center text-xs"><p className="text-muted-foreground">60d</p><p className="font-bold text-green-700">{s.uptime60d}%</p></div>
                <div className="rounded bg-green-50 p-2 text-center text-xs"><p className="text-muted-foreground">90d</p><p className="font-bold text-green-700">{s.uptime90d}%</p></div>
              </div>
            </div>
          )) || <p className="text-muted-foreground">Loading services...</p>}
        </div>
      </main>
    </div>
  )
}
