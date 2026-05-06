"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, UsersRound, MapPin, Clock } from "lucide-react";

export default function GroupsPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/groups")
      .then((r) => r.json())
      .then((data) => { setGroups(data); setLoading(false); });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Grupos / Células</h1>
          <p className="text-muted-foreground">Gerencie os grupos e células da sua igreja</p>
        </div>
        <Link href="/dashboard/groups/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Grupo
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-36 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <UsersRound className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">Nenhum grupo cadastrado</p>
            <p className="text-muted-foreground text-sm mt-1">Crie o primeiro grupo da sua igreja.</p>
            <Link href="/dashboard/groups/new" className="mt-4 inline-block">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Criar Grupo
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {groups.map((group) => (
            <Link key={group.id} href={`/dashboard/groups/${group.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <UsersRound className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
                      {group._count.members} membros
                    </span>
                  </div>
                  <p className="font-semibold">{group.name}</p>
                  {group.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{group.description}</p>
                  )}
                  <div className="mt-3 space-y-1">
                    {group.meetingDay && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {group.meetingDay}{group.meetingTime ? ` às ${group.meetingTime}` : ""}
                      </div>
                    )}
                    {group.location && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {group.location}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
