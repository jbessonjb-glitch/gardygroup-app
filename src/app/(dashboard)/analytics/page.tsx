"use client"

import { useState, useEffect } from "react"
import { Loader2, RefreshCw } from "lucide-react"

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <button onClick={() => window.location.reload()} className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-5"><p className="text-sm text-muted-foreground">MRR</p><p className="mt-2 text-2xl font-bold">${data?.kpi?.mrr?.toLocaleString() || "0"}</p></div>
        <div className="rounded-xl border bg-card p-5"><p className="text-sm text-muted-foreground">Total Users</p><p className="mt-2 text-2xl font-bold">{data?.kpi?.totalUsers?.toLocaleString() || "0"}</p></div>
        <div className="rounded-xl border bg-card p-5"><p className="text-sm text-muted-foreground">Conversion</p><p className="mt-2 text-2xl font-bold">{data?.kpi?.conversionRate || "0%"}</p></div>
        <div className="rounded-xl border bg-card p-5"><p className="text-sm text-muted-foreground">Churn</p><p className="mt-2 text-2xl font-bold">{data?.kpi?.churnRate || "0%"}</p></div>
      </div>
      <div className="rounded-xl border bg-card p-8 text-center">
        <p className="text-muted-foreground">Charts coming in next update. Data is being collected.</p>
      </div>
    </div>
  )
}
