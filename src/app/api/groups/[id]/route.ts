import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const groupSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  meetingDay: z.string().optional(),
  meetingTime: z.string().optional(),
  location: z.string().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const churchId = (session.user as any).churchId;
  const group = await prisma.group.findFirst({
    where: { id: params.id, churchId },
    include: {
      members: {
        include: { member: { select: { id: true, name: true, phone: true, status: true } } },
      },
    },
  });

  if (!group) return NextResponse.json({ error: "Grupo não encontrado" }, { status: 404 });
  return NextResponse.json(group);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const churchId = (session.user as any).churchId;
  const existing = await prisma.group.findFirst({ where: { id: params.id, churchId } });
  if (!existing) return NextResponse.json({ error: "Grupo não encontrado" }, { status: 404 });

  try {
    const body = await req.json();
    const data = groupSchema.parse(body);
    const group = await prisma.group.update({ where: { id: params.id }, data });
    return NextResponse.json(group);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const churchId = (session.user as any).churchId;
  const existing = await prisma.group.findFirst({ where: { id: params.id, churchId } });
  if (!existing) return NextResponse.json({ error: "Grupo não encontrado" }, { status: 404 });

  await prisma.group.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
