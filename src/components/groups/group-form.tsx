"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { WEEK_DAYS } from "@/types";

interface GroupFormProps {
  defaultValues?: any;
  groupId?: string;
}

export function GroupForm({ defaultValues, groupId }: GroupFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: defaultValues?.name || "",
    description: defaultValues?.description || "",
    meetingDay: defaultValues?.meetingDay || "",
    meetingTime: defaultValues?.meetingTime || "",
    location: defaultValues?.location || "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = groupId ? `/api/groups/${groupId}` : "/api/groups";
    const method = groupId ? "PUT" : "POST";

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
      router.push(groupId ? `/dashboard/groups/${groupId}` : "/dashboard/groups");
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="name">Nome do Grupo *</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="Célula Centro" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" name="description" value={form.description} onChange={handleChange} placeholder="Descrição do grupo..." rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Dia de Reunião</Label>
              <Select value={form.meetingDay} onValueChange={(v) => setForm({ ...form, meetingDay: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o dia" />
                </SelectTrigger>
                <SelectContent>
                  {WEEK_DAYS.map((day) => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="meetingTime">Horário</Label>
              <Input id="meetingTime" name="meetingTime" type="time" value={form.meetingTime} onChange={handleChange} />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="location">Local</Label>
              <Input id="location" name="location" value={form.location} onChange={handleChange} placeholder="Rua das Flores, 100" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : groupId ? "Salvar alterações" : "Criar grupo"}
        </Button>
      </div>
    </form>
  );
}
