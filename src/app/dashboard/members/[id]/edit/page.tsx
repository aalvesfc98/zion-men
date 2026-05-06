import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MemberForm } from "@/components/members/member-form";

export default async function EditMemberPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const churchId = (session?.user as any)?.churchId;

  const member = await prisma.member.findFirst({
    where: { id: params.id, churchId },
  });

  if (!member) notFound();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Editar Membro</h1>
        <p className="text-muted-foreground">Atualize os dados de {member.name}</p>
      </div>
      <MemberForm defaultValues={member} memberId={member.id} />
    </div>
  );
}
