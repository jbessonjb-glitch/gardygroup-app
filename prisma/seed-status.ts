import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const services = [
    { name: "api", displayName: "API", category: "core", status: "operational", uptime30d: 99.98, uptime60d: 99.95, uptime90d: 99.92 },
    { name: "webapp", displayName: "Web Application", category: "core", status: "operational", uptime30d: 99.99, uptime60d: 99.97, uptime90d: 99.94 },
    { name: "auth", displayName: "Authentication", category: "core", status: "operational", uptime30d: 99.97, uptime60d: 99.96, uptime90d: 99.91 },
    { name: "database", displayName: "Database", category: "infrastructure", status: "operational", uptime30d: 100, uptime60d: 99.99, uptime90d: 99.98 },
    { name: "payments", displayName: "Payments & Billing", category: "core", status: "operational", uptime30d: 99.95, uptime60d: 99.93, uptime90d: 99.90 },
    { name: "cdn", displayName: "CDN & Assets", category: "infrastructure", status: "operational", uptime30d: 99.99, uptime60d: 99.98, uptime90d: 99.97 },
    { name: "webhooks", displayName: "Webhooks", category: "integrations", status: "operational", uptime30d: 99.92, uptime60d: 99.88, uptime90d: 99.85 },
    { name: "email", displayName: "Email Delivery", category: "integrations", status: "operational", uptime30d: 99.90, uptime60d: 99.87, uptime90d: 99.83 },
  ]

  for (const svc of services) {
    await prisma.serviceStatus.upsert({
      where: { name: svc.name },
      update: {},
      create: svc,
    })
  }

  const apiService = await prisma.serviceStatus.findUnique({ where: { name: "api" } })
  const dbService = await prisma.serviceStatus.findUnique({ where: { name: "database" } })
  const whService = await prisma.serviceStatus.findUnique({ where: { name: "webhooks" } })

  const incidents = [
    {
      title: "Elevated API latency",
      description: "We are investigating reports of slower than normal API response times affecting the dashboard and API endpoints.",
      status: "resolved",
      severity: "minor",
      serviceId: apiService?.id,
      startedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 45),
    },
    {
      title: "Database connection pool exhaustion",
      description: "A spike in traffic caused our primary database connection pool to reach capacity. We have scaled the pool and are monitoring.",
      status: "resolved",
      severity: "major",
      serviceId: dbService?.id,
      startedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
      resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12 + 1000 * 60 * 30),
    },
    {
      title: "Webhook delivery delays",
      description: "Webhook events are experiencing delays of up to 5 minutes. The queue is being processed and we expect full recovery shortly.",
      status: "monitoring",
      severity: "minor",
      serviceId: whService?.id,
      startedAt: new Date(Date.now() - 1000 * 60 * 30),
      resolvedAt: null,
    },
  ]

  for (const inc of incidents) {
    if (inc.serviceId) {
      await prisma.incident.create({ data: inc as any })
    }
  }

  console.log("Seeded status page data")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
