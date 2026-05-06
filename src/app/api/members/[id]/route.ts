import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const memberSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  birthDate: z.string().optional(),
  baptismDate: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "VISITOR", "DEACON", "ELDER", "PASTOR"]).default("ACTIVE"),
  notes: z.string().optional(),
});

async function getMember(id: string, churchId: string) {
  return prisma.member.findFirst({ where: { id, churchId } });
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const churchId = (session.user as any).churchId;
  const member = await prisma.member.findFirst({
    where: { id: params.id, churchId },
    include: { groups: { include: { group: true } } },
  });

  if (!member) return NextResponse.json({ error: "Membro não encontrado" }, { status: 404 });
  return NextResponse.json(member);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const churchId = (session.user as any).churchId;
  const existing = await getMember(params.id, churchId);
  if (!existing) return NextResponse.json({ error: "Membro não encontrado" }, { status: 404 });

  try {
    const body = await req.json();
    const data = memberSchema.parse(body);

    const member = await prisma.member.update({
      where: { id: params.id },
      data: {
        ...data,
        email: data.email || null,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        baptismDate: data.baptismDate ? new Date(data.baptismDate) : null,
      },
    });

    return NextResponse.json(member);
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
  const existing = await getMember(params.id, churchId);
  if (!existing) return NextResponse.json({ error: "Membro não encontrado" }, { status: 404 });

  await prisma.member.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
