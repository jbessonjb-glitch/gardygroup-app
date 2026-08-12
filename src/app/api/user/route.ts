export const dynamic = 'force-dynamic';

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
