#!/bin/bash
# SaaS Starter Setup Script
# Run from ~/Developer/saas-starter

set -e

echo "Creating directories..."
mkdir -p prisma
mkdir -p "src/app/api/auth/[...nextauth]"
mkdir -p src/app/api/register
mkdir -p src/app/api/user
mkdir -p src/app/api/team
mkdir -p "src/app/api/team/[id]"
mkdir -p src/app/api/analytics
mkdir -p src/app/api/status
mkdir -p "src/app/(auth)/login"
mkdir -p "src/app/(auth)/register"
mkdir -p "src/app/(dashboard)/dashboard"
mkdir -p "src/app/(dashboard)/settings"
mkdir -p "src/app/(dashboard)/team"
mkdir -p "src/app/(dashboard)/analytics"
mkdir -p src/app/status
mkdir -p src/components/team
mkdir -p src/components/analytics
mkdir -p src/components/status
mkdir -p src/lib
mkdir -p src/types

echo "Writing files..."

# ============================================================================
# CONFIG FILES (already exist, skip)
# ============================================================================

# ============================================================================
# PRISMA
# ============================================================================

cat > prisma/schema.prisma << 'PRISMAEOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  password      String?
  image         String?
  role          String    @default("user")
  plan          String    @default("free")
  createdAt     DateTime  @default(now())
  accounts      Account[]
  sessions      Session[]
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model TeamMember {
  id        String   @id @default(cuid())
  email     String
  name      String?
  role      String   @default("viewer")
  status    String   @default("pending")
  invitedBy String
  userId    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([invitedBy])
}

model ServiceStatus {
  id          String     @id @default(cuid())
  name        String     @unique
  displayName String
  category    String     @default("core")
  status      String     @default("operational")
  uptime30d   Float      @default(100)
  uptime60d   Float      @default(100)
  uptime90d   Float      @default(100)
  updatedAt   DateTime   @updatedAt
  incidents   Incident[]
}

model Incident {
  id          String          @id @default(cuid())
  title       String
  description String?
  status      String          @default("investigating")
  severity    String          @default("minor")
  serviceId   String?
  service     ServiceStatus?  @relation(fields: [serviceId], references: [id])
  startedAt   DateTime        @default(now())
  resolvedAt  DateTime?
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
}
PRISMAEOF

cat > prisma/seed.ts << 'SEEDEOF'
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const hashed = await bcrypt.hash("password123", 10)

  await prisma.user.upsert({
    where: { email: "admin@saas.app" },
    update: {},
    create: {
      email: "admin@saas.app",
      name: "Admin User",
      password: hashed,
      role: "admin",
      plan: "pro",
    },
  })

  await prisma.user.upsert({
    where: { email: "demo@saas.app" },
    update: {},
    create: {
      email: "demo@saas.app",
      name: "Demo User",
      password: hashed,
      role: "user",
      plan: "free",
    },
  })

  console.log("Seeded database")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
SEEDEOF

cat > prisma/seed-status.ts << 'STATUSEOF'
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
STATUSEOF

# ============================================================================
# LIB
# ============================================================================

cat > src/lib/utils.ts << 'EOF'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
EOF

cat > src/lib/prisma.ts << 'EOF'
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
EOF

# ============================================================================
# TYPES
# ============================================================================

cat > src/types/next-auth.d.ts << 'EOF'
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
      plan: string
    }
  }

  interface User {
    role?: string
    plan?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    plan?: string
  }
}
EOF

cat > src/types/team.ts << 'EOF'
export interface TeamMember {
  id: string
  email: string
  name: string | null
  role: "admin" | "editor" | "viewer"
  status: "pending" | "active" | "inactive"
  createdAt: string
  updatedAt: string
}

export type SortField = "name" | "email" | "role" | "status" | "createdAt"
export type SortOrder = "asc" | "desc"
EOF

# ============================================================================
# AUTH
# ============================================================================

cat > src/auth.ts << 'EOF'
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          plan: user.plan,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.plan = user.plan
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string
        session.user.role = token.role as string
        session.user.plan = token.plan as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})
EOF

cat > src/middleware.ts << 'EOF'
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard")
  const isSettings = req.nextUrl.pathname.startsWith("/settings")
  const isTeam = req.nextUrl.pathname.startsWith("/team")
  const isAnalytics = req.nextUrl.pathname.startsWith("/analytics")

  if (!isLoggedIn && (isDashboard || isSettings || isTeam || isAnalytics)) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (isLoggedIn && (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|status).*)"],
}
EOF

# ============================================================================
# API ROUTES
# ============================================================================

cat > "src/app/api/auth/[...nextauth]/route.ts" << 'EOF'
import { handlers } from "@/auth"
export const { GET, POST } = handlers
EOF

cat > src/app/api/register/route.ts << 'EOF'
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = registerSchema.parse(body)

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
      select: { id: true, email: true, name: true },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
EOF

cat > src/app/api/user/route.ts << 'EOF'
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function PUT(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, currentPassword, newPassword } = body

    const updateData: any = {}
    if (name) updateData.name = name

    if (currentPassword && newPassword) {
      const user = await prisma.user.findUnique({ where: { id: session.user.id } })
      if (!user?.password) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      const isValid = await bcrypt.compare(currentPassword, user.password)
      if (!isValid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
      }

      updateData.password = await bcrypt.hash(newPassword, 10)
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: { id: true, name: true, email: true, plan: true, role: true },
    })

    return NextResponse.json({ user: updated })
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}
EOF

cat > src/app/api/team/route.ts << 'EOF'
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { z } from "zod"

const inviteSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  role: z.enum(["admin", "editor", "viewer"]),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const members = await prisma.teamMember.findMany({
    where: { invitedBy: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ members })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { email, name, role } = inviteSchema.parse(body)

    const existing = await prisma.teamMember.findFirst({
      where: { email, invitedBy: session.user.id },
    })

    if (existing) {
      return NextResponse.json({ error: "Member already invited" }, { status: 400 })
    }

    const member = await prisma.teamMember.create({
      data: {
        email,
        name: name || null,
        role,
        invitedBy: session.user.id,
        status: "pending",
      },
    })

    return NextResponse.json({ member }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
EOF

cat > "src/app/api/team/[id]/route.ts" << 'EOF'
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { role, status } = body

    const member = await prisma.teamMember.updateMany({
      where: { id: params.id, invitedBy: session.user.id },
      data: { ...(role && { role }), ...(status && { status }) },
    })

    if (member.count === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await prisma.teamMember.deleteMany({
    where: { id: params.id, invitedBy: session.user.id },
  })

  return NextResponse.json({ success: true })
}
EOF

cat > src/app/api/analytics/route.ts << 'EOF'
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
EOF

cat > src/app/api/status/route.ts << 'EOF'
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
EOF

echo "API routes done."
