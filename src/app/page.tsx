import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ArrowRight, Check, Shield, Zap, BarChart3, Activity } from "lucide-react"

export default async function Home() {
  const session = await auth()
  if (session) redirect("/dashboard")

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">The Gardy Group</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/status" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              System Status
            </Link>
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">Sign in</Link>
            <Link href="/register" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Get Started</Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Build your business faster</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">A production-ready starter with authentication, database, billing scaffolding, and a beautiful dashboard.</p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/register" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">Start for free <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/login" className="inline-flex items-center rounded-lg border px-6 py-3 text-sm font-medium hover:bg-accent">View Demo</Link>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border bg-card p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Shield className="h-6 w-6" /></div>
              <h3 className="text-lg font-semibold">Secure Auth</h3>
              <p className="mt-2 text-muted-foreground">JWT-based authentication with bcrypt password hashing and protected routes out of the box.</p>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><BarChart3 className="h-6 w-6" /></div>
              <h3 className="text-lg font-semibold">Admin Dashboard</h3>
              <p className="mt-2 text-muted-foreground">Beautiful dashboard with stats, user management, and role-based access control.</p>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Zap className="h-6 w-6" /></div>
              <h3 className="text-lg font-semibold">Subscription Ready</h3>
              <p className="mt-2 text-muted-foreground">Built-in plan tiers (Free / Pro). Drop in Stripe and you're ready to charge customers.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold">Simple Pricing</h2>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:max-w-4xl lg:mx-auto">
            <div className="rounded-xl border p-8 bg-card">
              <h3 className="text-lg font-semibold">Free</h3>
              <p className="mt-2 text-sm text-muted-foreground">Perfect for getting started</p>
              <div className="mt-4 flex items-baseline"><span className="text-4xl font-bold">$0</span></div>
              <ul className="mt-6 space-y-3">
                {["1 project", "Basic analytics", "Community support"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-500" />{f}</li>
                ))}
              </ul>
              <Link href="/register" className="mt-8 block w-full rounded-lg border px-4 py-2 text-center text-sm font-medium hover:bg-accent">Get Started</Link>
            </div>
            <div className="rounded-xl border p-8 border-primary ring-1 ring-primary">
              <h3 className="text-lg font-semibold">Pro</h3>
              <p className="mt-2 text-sm text-muted-foreground">Everything you need to scale</p>
              <div className="mt-4 flex items-baseline"><span className="text-4xl font-bold">$19</span><span className="ml-1 text-muted-foreground">/month</span></div>
              <ul className="mt-6 space-y-3">
                {["Unlimited projects", "Advanced analytics", "Priority support", "Custom domains", "Team collaboration"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-500" />{f}</li>
                ))}
              </ul>
              <Link href="/register" className="mt-8 block w-full rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90">Upgrade to Pro</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
