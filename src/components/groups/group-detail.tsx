"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Edit, Trash2, MapPin, Clock, UserPlus, X } from "lucide-react";
import { MEMBER_STATUS_LABELS, MEMBER_STATUS_COLORS, type MemberStatus } from "@/types";

interface GroupDetailProps {
  group: any;
  allMembers: { id: string; name: string }[];
}

export function GroupDetail({ group: initialGroup, allMembers }: GroupDetailProps) {
  const router = useRouter();
  const [group, setGroup] = useState(initialGroup);
  const [selectedMember, setSelectedMember] = useState("");
  const [addingMember, setAddingMember] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const memberIds = group.members.map((m: any) => m.memberId);
  const availableMembers = allMembers.filter((m) => !memberIds.includes(m.id));

  async function handleAddMember() {
    if (!selectedMember) return;
    setAddingMember(true);
    const res = await fetch(`/api/groups/${group.id}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId: selectedMember }),
    });
    if (res.ok) {
      const added = allMembers.find((m) => m.id === selectedMember);
      setGroup({
        ...group,
        members: [...group.members, { memberId: selectedMember, member: { ...added, status: "ACTIVE" } }],
      });
      setSelectedMember("");
    }
    setAddingMember(false);
  }

  async function handleRemoveMember(memberId: string) {
    await fetch(`/api/groups/${group.id}/members`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId }),
    });
    setGroup({ ...group, members: group.members.filter((m: any) => m.memberId !== memberId) });
  }

  async function handleDeleteGroup() {
    if (!confirm(`Excluir o grupo "${group.name}"?`)) return;
    setDeleting(true);
    await fetch(`/api/groups/${group.id}`, { method: "DELETE" });
    router.push("/dashboard/groups");
    router.refresh();
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{group.name}</h1>
          {group.description && <p className="text-muted-foreground text-sm">{group.description}</p>}
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/groups/${group.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </Link>
          <Button variant="destructive" size="sm" onClick={handleDeleteGroup} disabled={deleting}>
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(group.meetingDay || group.location) && (
          <Card>
            <CardHeader><CardTitle className="text-base">Informações</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {group.meetingDay && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{group.meetingDay}{group.meetingTime ? ` às ${group.meetingTime}` : ""}</span>
                </div>
              )}
              {group.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{group.location}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Membros ({group.members.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableMembers.length > 0 && (
              <div className="flex gap-2">
                <Select value={selectedMember} onValueChange={setSelectedMember}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Adicionar membro ao grupo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMembers.map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddMember} disabled={!selectedMember || addingMember} size="sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            )}

            {group.members.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-6">Nenhum membro neste grupo ainda.</p>
            ) : (
              <div className="space-y-2">
                {group.members.map((gm: any) => (
                  <div key={gm.memberId} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <Link href={`/dashboard/members/${gm.member.id}`} className="font-medium text-sm hover:underline">
                        {gm.member.name}
                      </Link>
                      {gm.member.phone && <p className="text-xs text-muted-foreground">{gm.member.phone}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${MEMBER_STATUS_COLORS[gm.member.status as MemberStatus]}`}>
                        {MEMBER_STATUS_LABELS[gm.member.status as MemberStatus]}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveMember(gm.memberId)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
