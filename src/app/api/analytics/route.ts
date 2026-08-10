import { auth } from "@/auth"
import { NextResponse } from "next/server"

function generateMonthlyData() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  let revenue = 1200
  let users = 45

  return months.map((month) => {
    revenue += Math.floor(Math.random() * 800) + 200
    users += Math.floor(Math.random() * 50) + 10
    return {
      month,
      revenue,
      newUsers: Math.floor(Math.random() * 40) + 5,
      activeUsers: users,
      pageViews: Math.floor(Math.random() * 5000) + 1000,
      sessions: Math.floor(Math.random() * 3000) + 500,
    }
  })
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const monthly = generateMonthlyData()
  const totalRevenue = monthly.reduce((sum, m) => sum + m.revenue, 0)
  const totalUsers = monthly[monthly.length - 1].activeUsers
  const avgSession = Math.floor(Math.random() * 120) + 60

  return NextResponse.json({
    monthly,
    kpi: {
      totalRevenue,
      totalUsers,
      avgSessionDuration: `${Math.floor(avgSession / 60)}m ${avgSession % 60}s`,
      conversionRate: "3.2%",
      mrr: monthly[monthly.length - 1].revenue,
      churnRate: "2.1%",
    },
    planDistribution: [
      { name: "Free", value: 68, color: "#94a3b8" },
      { name: "Pro", value: 24, color: "#3b82f6" },
      { name: "Enterprise", value: 8, color: "#8b5cf6" },
    ],
    funnel: [
      { stage: "Visitors", count: 12400 },
      { stage: "Signups", count: 3100 },
      { stage: "Onboarded", count: 1860 },
      { stage: "Paid", count: 620 },
    ],
  })
}
