import { MemberForm } from "@/components/members/member-form";

export default function NewMemberPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Novo Membro</h1>
        <p className="text-muted-foreground">Cadastre um novo membro na sua igreja</p>
      </div>
      <MemberForm />
    </div>
  );
}
