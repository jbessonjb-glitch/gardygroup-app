import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
  icon: React.ReactNode
}

export function StatsCard({ title, value, change, trend, icon }: StatsCardProps) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <div className="mt-1 flex items-center gap-1 text-xs">
        {trend === "up" && <ArrowUpRight className="h-3 w-3 text-green-500" />}
        {trend === "down" && <ArrowDownRight className="h-3 w-3 text-red-500" />}
        <span className={trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground"}>
          {change}
        </span>
      </div>
    </div>
  )
}
