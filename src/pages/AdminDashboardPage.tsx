import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, Building2, ClipboardCheck, FileText, ShieldCheck, Ship, Store, UserCheck, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-700 text-white shadow-sm">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">Roseair</p>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-red-700">Marketplace</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="border-slate-300">
              <Link to="/agent">Painel do Agente</Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-300">
              <Link to="/analytics">Analytics</Link>
            </Button>
            <Button asChild className="bg-red-700 hover:bg-red-800">
              <Link to="/marketplace">Marketplace</Link>
            </Button>
          </div>
        </div>
      </header>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Painel de Admin</Badge>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">Controlo de Operações Roseair</h1>
          <p className="mt-2 text-slate-600">Monitore utilizadores, anúncios, envios, desalfandegamento e capacidade de armazém.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-5 md:grid-cols-5">
          {[
            [Users, "Utilizadores", "312"],
            [Building2, "Agentes", "46"],
            [Ship, "Envios", "89"],
            [ShieldCheck, "Taxa de desalfandegamento", "96%"],
            [AlertTriangle, "Exceções", "6"],
          ].map(([Icon, label, value]) => {
            const KpiIcon = Icon as typeof Users;

            return (
              <Card key={String(label)} className="border-slate-200 bg-white">
                <CardContent className="p-5">
                  <KpiIcon className="h-5 w-5 text-red-700" />
                  <p className="mt-4 text-2xl font-bold">{String(value)}</p>
                  <p className="mt-1 text-sm text-slate-500">{String(label)}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Card className="border-red-100 bg-white transition hover:-translate-y-1 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-700">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">Gestão de Cotações</h3>
                  <p className="mt-2 text-sm text-slate-500">Revise e aprove solicitações de cotação dos compradores do marketplace.</p>
                </div>
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">3 pendentes</Badge>
              </div>
              <Button asChild className="mt-6 w-full bg-red-700 hover:bg-red-800">
                <Link to="/admin/quotes">Gerir Cotações <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-red-100 bg-white transition hover:-translate-y-1 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-700">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">Aprovação de Agentes</h3>
                  <p className="mt-2 text-sm text-slate-500">Valide e aprove agentes chineses que solicitaram registo no marketplace.</p>
                </div>
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">3 pendentes</Badge>
              </div>
              <Button asChild className="mt-6 w-full bg-red-700 hover:bg-red-800">
                <Link to="/admin/agents">Aprovar Agentes <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle>Exceções de Envio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "BL pendente do agente de Shenzhen",
                "Inspeção aduaneira de Maputo agendada",
                "Vaga no armazém da Beira a 72% de ocupação",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
                  <AlertTriangle className="h-5 w-5 text-red-700" />
                  <p className="font-medium">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-red-700" /> Utilização de Armazém
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {[
                ["Maputo Hub", 68],
                ["Matola Yard", 54],
                ["Beira Cross-Dock", 72],
              ].map(([label, value]) => (
                <div key={String(label)}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium">{String(label)}</span>
                    <span className="text-slate-500">{Number(value)}%</span>
                  </div>
                  <Progress value={Number(value)} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
