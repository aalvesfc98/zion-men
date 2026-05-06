import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const registerSchema = z.object({
  churchName: z.string().min(3),
  churchEmail: z.string().email(),
  churchPhone: z.string().optional(),
  churchCity: z.string().optional(),
  churchState: z.string().optional(),
  adminName: z.string().min(3),
  adminEmail: z.string().email(),
  adminPassword: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    const existingChurch = await prisma.church.findUnique({
      where: { email: data.churchEmail },
    });
    if (existingChurch) {
      return NextResponse.json({ error: "Email da igreja já cadastrado" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: data.adminEmail },
    });
    if (existingUser) {
      return NextResponse.json({ error: "Email do administrador já cadastrado" }, { status: 400 });
    }

    const slug = slugify(data.churchName);
    const hashedPassword = await bcrypt.hash(data.adminPassword, 10);

    const church = await prisma.church.create({
      data: {
        name: data.churchName,
        slug,
        email: data.churchEmail,
        phone: data.churchPhone,
        city: data.churchCity,
        state: data.churchState,
        users: {
          create: {
            name: data.adminName,
            email: data.adminEmail,
            password: hashedPassword,
            role: "ADMIN",
          },
        },
      },
    });

    return NextResponse.json({ success: true, churchId: church.id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
