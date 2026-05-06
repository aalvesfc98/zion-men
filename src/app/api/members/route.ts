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

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const churchId = (session.user as any).churchId;
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  const members = await prisma.member.findMany({
    where: {
      churchId,
      ...(search && { name: { contains: search, mode: "insensitive" } }),
      ...(status && { status: status as any }),
    },
    include: { groups: { include: { group: { select: { id: true, name: true } } } } },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const churchId = (session.user as any).churchId;

  try {
    const body = await req.json();
    const data = memberSchema.parse(body);

    const member = await prisma.member.create({
      data: {
        ...data,
        email: data.email || null,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        baptismDate: data.baptismDate ? new Date(data.baptismDate) : null,
        churchId,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
