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
