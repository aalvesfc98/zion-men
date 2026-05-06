import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const churchId = (session.user as any).churchId;
  const group = await prisma.group.findFirst({ where: { id: params.id, churchId } });
  if (!group) return NextResponse.json({ error: "Grupo não encontrado" }, { status: 404 });

  const { memberId } = await req.json();
  const member = await prisma.member.findFirst({ where: { id: memberId, churchId } });
  if (!member) return NextResponse.json({ error: "Membro não encontrado" }, { status: 404 });

  const existing = await prisma.groupMember.findUnique({
    where: { groupId_memberId: { groupId: params.id, memberId } },
  });
  if (existing) return NextResponse.json({ error: "Membro já está no grupo" }, { status: 400 });

  await prisma.groupMember.create({ data: { groupId: params.id, memberId } });
  return NextResponse.json({ success: true }, { status: 201 });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const churchId = (session.user as any).churchId;
  const group = await prisma.group.findFirst({ where: { id: params.id, churchId } });
  if (!group) return NextResponse.json({ error: "Grupo não encontrado" }, { status: 404 });

  const { memberId } = await req.json();
  await prisma.groupMember.deleteMany({ where: { groupId: params.id, memberId } });
  return NextResponse.json({ success: true });
}
