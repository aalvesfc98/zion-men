"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MEMBER_STATUS_LABELS, MEMBER_STATUS_COLORS, type MemberStatus } from "@/types";
import { Plus, Search, Filter, Phone } from "lucide-react";

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function getAvatarColor(name: string) {
  const colors = [
    "bg-purple-500", "bg-blue-500", "bg-green-500",
    "bg-yellow-500", "bg-red-500", "bg-indigo-500",
    "bg-pink-500", "bg-teal-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export default function MembersPage() {
  const { data: session } = useSession();
  const churchName = (session?.user as any)?.churchName || "Igreja";

  const [members, setMembers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);

  async function fetchMembers() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status && status !== "ALL") params.set("status", status);
    const res = await fetch(`/api/members?${params}`);
    const data = await res.json();
    setMembers(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { fetchMembers(); }, [status]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchMembers();
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Membros</h1>
        <Link href="/dashboard/members/new">
          <Button className="bg-green-500 hover:bg-green-600 text-white gap-2">
            <Plus className="w-4 h-4" />
            Novo
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-sm">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Pesquise aqui"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </form>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Situação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos</SelectItem>
            {Object.entries(MEMBER_STATUS_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3 w-24">Matrícula</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Nome Completo</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Igreja</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden sm:table-cell">Situação</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Contato</th>
              <th className="w-10 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b">
                  <td colSpan={6} className="px-6 py-4">
                    <div className="h-4 bg-gray-100 animate-pulse rounded w-full" />
                  </td>
                </tr>
              ))
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-muted-foreground">
                  <p className="text-base font-medium">Nenhum membro encontrado</p>
                  <p className="text-sm mt-1">
                    {search || status !== "ALL" ? "Tente outros filtros." : "Cadastre o primeiro membro da sua igreja."}
                  </p>
                </td>
              </tr>
            ) : (
              members.map((member, index) => (
                <tr key={member.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                    {String(index + 1).padStart(3, "0")}
                  </td>
                  <td className="px-4 py-4">
                    <Link href={`/dashboard/members/${member.id}`} className="flex items-center gap-3 hover:underline">
                      <div className={`w-9 h-9 rounded-full ${getAvatarColor(member.name)} flex items-center justify-center shrink-0`}>
                        <span className="text-white text-xs font-bold">{getInitials(member.name)}</span>
                      </div>
                      <span className="font-medium text-sm text-gray-800">{member.name}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 hidden md:table-cell">{churchName}</td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span className={`text-sm font-semibold ${
                      member.status === "ACTIVE" ? "text-green-600" :
                      member.status === "INACTIVE" ? "text-gray-400" :
                      member.status === "VISITOR" ? "text-blue-600" :
                      "text-purple-600"
                    }`}>
                      {MEMBER_STATUS_LABELS[member.status as MemberStatus]}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    {member.phone ? (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <Phone className="w-3 h-3 text-white" />
                        </div>
                        {member.phone}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/dashboard/members/${member.id}`}
                      className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                    >
                      ⋮
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {members.length > 0 && (
          <div className="px-6 py-3 border-t bg-gray-50 text-xs text-gray-500">
            Total: {members.length} membro{members.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}
