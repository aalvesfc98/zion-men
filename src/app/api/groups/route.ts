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

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const churchId = (session.user as any).churchId;
  const groups = await prisma.group.findMany({
    where: { churchId },
    include: { _count: { select: { members: true } } },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(groups);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const churchId = (session.user as any).churchId;

  try {
    const body = await req.json();
    const data = groupSchema.parse(body);
    const group = await prisma.group.create({ data: { ...data, churchId } });
    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
