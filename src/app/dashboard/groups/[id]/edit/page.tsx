import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GroupForm } from "@/components/groups/group-form";

export default async function EditGroupPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const churchId = (session?.user as any)?.churchId;

  const group = await prisma.group.findFirst({
    where: { id: params.id, churchId },
  });

  if (!group) notFound();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Editar Grupo</h1>
        <p className="text-muted-foreground">Atualize os dados de {group.name}</p>
      </div>
      <GroupForm defaultValues={group} groupId={group.id} />
    </div>
  );
}
