"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MEMBER_STATUS_LABELS, MEMBER_STATUS_COLORS, type MemberStatus } from "@/types";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Edit, Trash2, Phone, Mail, MapPin, Calendar } from "lucide-react";

interface MemberDetailProps {
  member: any;
}

export function MemberDetail({ member }: MemberDetailProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Tem certeza que deseja excluir ${member.name}?`)) return;
    setDeleting(true);
    await fetch(`/api/members/${member.id}`, { method: "DELETE" });
    router.push("/dashboard/members");
    router.refresh();
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{member.name}</h1>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${MEMBER_STATUS_COLORS[member.status as MemberStatus]}`}>
            {MEMBER_STATUS_LABELS[member.status as MemberStatus]}
          </span>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/members/${member.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </Link>
          <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{member.phone || "Não informado"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{member.email || "Não informado"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{member.address ? `${member.address}${member.city ? `, ${member.city}` : ""}` : "Não informado"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Datas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs">Nascimento</p>
                <p>{formatDate(member.birthDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs">Batismo</p>
                <p>{formatDate(member.baptismDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs">Membro desde</p>
                <p>{formatDate(member.joinDate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {member.groups?.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Grupos / Células</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {member.groups.map((g: any) => (
                <Link key={g.group.id} href={`/dashboard/groups/${g.group.id}`}>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/70">
                    {g.group.name}
                  </Badge>
                </Link>
              ))}
            </CardContent>
          </Card>
        )}

        {member.notes && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{member.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
