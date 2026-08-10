import { auth } from "@/auth"
import { StatsCard } from "@/components/stats-card"
import { PlanBadge } from "@/components/plan-badge"
import { Users, CreditCard, Activity, TrendingUp, ArrowUpRight } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session?.user?.name || "User"}</p>
        </div>
        <PlanBadge plan={session?.user?.plan || "free"} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Revenue" value="$45,231.89" change="+20.1%" trend="up" icon={<CreditCard className="h-4 w-4" />} />
        <StatsCard title="Active Users" value="2,350" change="+180.1%" trend="up" icon={<Users className="h-4 w-4" />} />
        <StatsCard title="Sales" value="+12,234" change="+19%" trend="up" icon={<TrendingUp className="h-4 w-4" />} />
        <StatsCard title="Active Now" value="+573" change="-4 since last hour" trend="neutral" icon={<Activity className="h-4 w-4" />} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold">Recent Activity</h3>
          <div className="mt-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted"><Users className="h-4 w-4" /></div>
                  <div>
                    <p className="text-sm font-medium">New user registered</p>
                    <p className="text-xs text-muted-foreground">{i * 2} minutes ago</p>
                  </div>
                </div>
                <span className="text-xs text-green-500 flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> +1</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold">Quick Actions</h3>
          <div className="mt-4 space-y-3">
            <ActionItem title="Upgrade to Pro" description="Unlock all features" action="Upgrade" href="/settings" show={session?.user?.plan === "free"} />
            <ActionItem title="Invite Team Members" description="Collaborate with your team" action="Invite" href="/team" />
            <ActionItem title="View Analytics" description="See your growth metrics" action="View" href="/analytics" />
            <ActionItem title="Contact Support" description="Get help from our team" action="Support" href="#" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ActionItem({ title, description, action, href, show = true }: { title: string; description: string; action: string; href: string; show?: boolean }) {
  if (!show) return null
  return (
    <a href={href} className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <span className="text-xs font-medium text-primary">{action}</span>
    </a>
  )
}
