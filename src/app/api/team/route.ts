export const dynamic = 'force-dynamic';

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
