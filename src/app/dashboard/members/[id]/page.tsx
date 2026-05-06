import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MemberDetail } from "@/components/members/member-detail";

export default async function MemberDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const churchId = (session?.user as any)?.churchId;

  const member = await prisma.member.findFirst({
    where: { id: params.id, churchId },
    include: { groups: { include: { group: { select: { id: true, name: true } } } } },
  });

  if (!member) notFound();

  return <MemberDetail member={member} />;
}
