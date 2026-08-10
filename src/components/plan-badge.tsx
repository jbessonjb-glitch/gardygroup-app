import { Crown } from "lucide-react"

export function PlanBadge({ plan }: { plan: string }) {
  const isPro = plan === "pro"

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${isPro ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"}`}>
      {isPro && <Crown className="h-3 w-3" />}
      {plan.charAt(0).toUpperCase() + plan.slice(1)}
    </span>
  )
}
