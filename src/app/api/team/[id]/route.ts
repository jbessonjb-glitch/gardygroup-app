export const dynamic = 'force-dynamic';

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
