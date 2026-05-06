"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Church } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    churchName: "",
    churchEmail: "",
    churchPhone: "",
    churchCity: "",
    churchState: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    confirmPassword: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.adminPassword !== form.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Erro ao cadastrar.");
    } else {
      router.push("/login?registered=true");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="w-full max-w-2xl">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Church className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Zion</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Cadastrar Igreja</CardTitle>
            <CardDescription>Crie a conta da sua igreja no sistema</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Dados da Igreja
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="churchName">Nome da Igreja *</Label>
                    <Input id="churchName" name="churchName" value={form.churchName} onChange={handleChange} required placeholder="Igreja Batista Central" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="churchEmail">Email da Igreja *</Label>
                    <Input id="churchEmail" name="churchEmail" type="email" value={form.churchEmail} onChange={handleChange} required placeholder="contato@igreja.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="churchPhone">Telefone</Label>
                    <Input id="churchPhone" name="churchPhone" value={form.churchPhone} onChange={handleChange} placeholder="(11) 99999-9999" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="churchCity">Cidade</Label>
                    <Input id="churchCity" name="churchCity" value={form.churchCity} onChange={handleChange} placeholder="São Paulo" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="churchState">Estado</Label>
                    <Input id="churchState" name="churchState" value={form.churchState} onChange={handleChange} placeholder="SP" maxLength={2} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Administrador
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="adminName">Nome Completo *</Label>
                    <Input id="adminName" name="adminName" value={form.adminName} onChange={handleChange} required placeholder="João Silva" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Email *</Label>
                    <Input id="adminEmail" name="adminEmail" type="email" value={form.adminEmail} onChange={handleChange} required placeholder="joao@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminPassword">Senha *</Label>
                    <Input id="adminPassword" name="adminPassword" type="password" value={form.adminPassword} onChange={handleChange} required placeholder="Mínimo 6 caracteres" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required placeholder="Repita a senha" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Cadastrando..." : "Criar conta"}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Já tem conta?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Entrar
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
