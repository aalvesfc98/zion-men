import { GroupForm } from "@/components/groups/group-form";

export default function NewGroupPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Novo Grupo</h1>
        <p className="text-muted-foreground">Crie um novo grupo ou célula</p>
      </div>
      <GroupForm />
    </div>
  );
}
