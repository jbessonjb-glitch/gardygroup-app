import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const services = await prisma.serviceStatus.findMany({
    orderBy: [{ category: "asc" }, { displayName: "asc" }],
  })

  const incidents = await prisma.incident.findMany({
    orderBy: { startedAt: "desc" },
    take: 20,
    include: { service: true },
  })

  const hasMajorOutage = services.some((s) => s.status === "major_outage")
  const hasPartialOutage = services.some((s) => s.status === "partial_outage")
  const hasDegraded = services.some((s) => s.status === "degraded")

  let overallStatus = "operational"
  let overallMessage = "All Systems Operational"

  if (hasMajorOutage) {
    overallStatus = "major_outage"
    overallMessage = "Major Service Outage"
  } else if (hasPartialOutage) {
    overallStatus = "partial_outage"
    overallMessage = "Partial Service Outage"
  } else if (hasDegraded) {
    overallStatus = "degraded"
    overallMessage = "Some Services Degraded"
  }

  const activeIncidents = incidents.filter((i) => i.status !== "resolved")
  const recentResolved = incidents.filter((i) => i.status === "resolved").slice(0, 10)

  return NextResponse.json({
    overallStatus,
    overallMessage,
    services,
    activeIncidents,
    recentResolved,
    liveMetrics: {
      activeUsers: 2347,
      requestsLastHour: 45200,
      avgResponseTime: "124ms",
    },
    lastUpdated: new Date().toISOString(),
  })
}
