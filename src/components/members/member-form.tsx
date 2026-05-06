"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MEMBER_STATUS_LABELS } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

interface MemberFormProps {
  defaultValues?: any;
  memberId?: string;
}

export function MemberForm({ defaultValues, memberId }: MemberFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: defaultValues?.name || "",
    email: defaultValues?.email || "",
    phone: defaultValues?.phone || "",
    address: defaultValues?.address || "",
    city: defaultValues?.city || "",
    birthDate: defaultValues?.birthDate ? defaultValues.birthDate.split("T")[0] : "",
    baptismDate: defaultValues?.baptismDate ? defaultValues.baptismDate.split("T")[0] : "",
    status: defaultValues?.status || "ACTIVE",
    notes: defaultValues?.notes || "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = memberId ? `/api/members/${memberId}` : "/api/members";
    const method = memberId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Erro ao salvar.");
    } else {
      router.push("/dashboard/members");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>
      )}

      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Dados Pessoais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="João da Silva" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="joao@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="(11) 99999-9999" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate">Data de Nascimento</Label>
              <Input id="birthDate" name="birthDate" type="date" value={form.birthDate} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="baptismDate">Data de Batismo</Label>
              <Input id="baptismDate" name="baptismDate" type="date" value={form.baptismDate} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input id="address" name="address" value={form.address} onChange={handleChange} placeholder="Rua das Flores, 123" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" name="city" value={form.city} onChange={handleChange} placeholder="São Paulo" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(MEMBER_STATUS_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea id="notes" name="notes" value={form.notes} onChange={handleChange} placeholder="Informações adicionais..." rows={3} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : memberId ? "Salvar alterações" : "Cadastrar membro"}
        </Button>
      </div>
    </form>
  );
}
