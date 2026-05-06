import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, UsersRound } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const churchId = (session?.user as any)?.churchId as string;

  const [totalMembers, activeMembers, inactiveMembers, totalGroups, recentMembers] =
    await Promise.all([
      prisma.member.count({ where: { churchId } }),
      prisma.member.count({ where: { churchId, status: "ACTIVE" } }),
      prisma.member.count({ where: { churchId, status: "INACTIVE" } }),
      prisma.group.count({ where: { churchId } }),
      prisma.member.findMany({
        where: { churchId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, status: true, joinDate: true, phone: true },
      }),
    ]);

  const stats = [
    { title: "Total de Membros", value: totalMembers, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Membros Ativos", value: activeMembers, icon: UserCheck, color: "text-green-600", bg: "bg-green-50" },
    { title: "Membros Inativos", value: inactiveMembers, icon: UserX, color: "text-red-600", bg: "bg-red-50" },
    { title: "Grupos / Células", value: totalGroups, icon: UsersRound, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral da sua igreja</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Membros Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentMembers.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">
              Nenhum membro cadastrado ainda.
            </p>
          ) : (
            <div className="space-y-3">
              {recentMembers.map((m) => (
                <div key={m.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-sm">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.phone || "Sem telefone"}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    m.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                    m.status === "INACTIVE" ? "bg-gray-100 text-gray-700" :
                    "bg-blue-100 text-blue-700"
                  }`}>
                    {m.status === "ACTIVE" ? "Ativo" : m.status === "INACTIVE" ? "Inativo" : "Visitante"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
