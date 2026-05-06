import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GroupDetail } from "@/components/groups/group-detail";

export default async function GroupDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const churchId = (session?.user as any)?.churchId;

  const [group, allMembers] = await Promise.all([
    prisma.group.findFirst({
      where: { id: params.id, churchId },
      include: {
        members: { include: { member: { select: { id: true, name: true, phone: true, status: true } } } },
      },
    }),
    prisma.member.findMany({
      where: { churchId, status: { not: "INACTIVE" } },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!group) notFound();

  return <GroupDetail group={group} allMembers={allMembers} />;
}
