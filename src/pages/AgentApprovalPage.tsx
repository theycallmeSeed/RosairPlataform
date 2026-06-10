import { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, CheckCircle2, Clock3, MapPin, Search, ShieldCheck, Store, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ApprovalStatus = "pending" | "approved" | "rejected";

type Agent = {
  id: string;
  name: string;
  city: string;
  categories: string;
  rating: string;
  response: string;
  readiness: number;
  registered: string;
  status: ApprovalStatus;
};

const initialAgents: Agent[] = [
  { id: "AGT-001", name: "Pearl River Export Co.", city: "Shenzhen", categories: "Eletrónica, energia, iluminação", rating: "4.8", response: "Resposta média 6h", readiness: 94, registered: "2026-06-01", status: "approved" },
  { id: "AGT-002", name: "Ningbo Trade Desk", city: "Ningbo", categories: "Embalagem, bens domésticos, têxteis", rating: "4.7", response: "Resposta média 9h", readiness: 89, registered: "2026-06-01", status: "approved" },
  { id: "AGT-003", name: "Foshan Industrial Supply", city: "Foshan", categories: "Construção, estantes, equipamentos", rating: "4.6", response: "Resposta média 12h", readiness: 83, registered: "2026-06-01", status: "approved" },
  { id: "AGT-004", name: "Qingdao Cold Chain Supply", city: "Qingdao", categories: "Equipamento alimentar, refrigeração", rating: "4.9", response: "Resposta média 4h", readiness: 91, registered: "2026-06-09", status: "pending" },
  { id: "AGT-005", name: "Zhongshan Lighting Export", city: "Zhongshan", categories: "Iluminação LED, eletrónica", rating: "4.7", response: "Resposta média 8h", readiness: 78, registered: "2026-06-09", status: "pending" },
  { id: "AGT-006", name: "Suzhou Med Supply Export", city: "Suzhou", categories: "Fornecimento médico, farmacêutico", rating: "4.8", response: "Resposta média 5h", readiness: 86, registered: "2026-06-08", status: "pending" },
  { id: "AGT-007", name: "Changzhou Solar Tech", city: "Changzhou", categories: "Energia solar, painéis, inversores", rating: "4.9", response: "Resposta média 3h", readiness: 95, registered: "2026-06-07", status: "rejected" },
];

const statusLabels: Record<ApprovalStatus, string> = { pending: "Pendente", approved: "Aprovado", rejected: "Rejeitado" };

export default function AgentApprovalPage() {
  const [agents, setAgents] = useState(initialAgents);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const updateStatus = (id: string, status: ApprovalStatus) => {
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const pendingCount = agents.filter((a) => a.status === "pending").length;
  const filtered = agents.filter((a) => {
    const matchesSearch = search.length === 0 || [a.name, a.city, a.categories, a.id].join(" ").toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || a.status === filter;
    return matchesSearch && matchesFilter;
  });

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
              <Link to="/admin">Painel de Admin</Link>
            </Button>
            <Button asChild className="bg-red-700 hover:bg-red-800">
              <Link to="/marketplace">Marketplace</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Aprovação de Agentes</Badge>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">Fila de Aprovação de Agentes</h1>
          <p className="mt-2 text-slate-600">Revise e aprove agentes chineses que solicitaram registo no marketplace Roseair.</p>

          {pendingCount > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800">
              <Clock3 className="h-4 w-4" /> {pendingCount} agente{pendingCount !== 1 ? "s" : ""} pendente{pendingCount !== 1 ? "s" : ""} de aprovação
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
              <Search className="h-5 w-5 text-slate-400" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} className="border-0 bg-transparent shadow-none focus-visible:ring-0" placeholder="Pesquisar por nome, cidade, especialidade..." />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Filtrar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="approved">Aprovados</SelectItem>
                <SelectItem value="rejected">Rejeitados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <p className="mb-4 text-sm text-slate-500">A mostrar {filtered.length} de {agents.length} agentes</p>
        <div className="space-y-4">
          {filtered.map((agent) => (
            <Card key={agent.id} className="border-slate-200 bg-white">
              <CardContent className="p-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-700">
                          <Building2 className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{agent.name}</h3>
                            <Badge className={
                              agent.status === "approved" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                              : agent.status === "rejected" ? "bg-red-100 text-red-700 hover:bg-red-100"
                              : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                            }>
                              {statusLabels[agent.status]}
                            </Badge>
                          </div>
                          <p className="mt-1 flex items-center gap-2 text-sm text-slate-500"><MapPin className="h-4 w-4 text-red-700" /> {agent.city}, China</p>
                        </div>
                      </div>
                      <Badge variant="outline">{agent.rating}</Badge>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Especialidade</p>
                        <p className="mt-1 text-sm font-medium">{agent.categories}</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Resposta</p>
                        <p className="mt-1 text-sm font-medium">{agent.response}</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Registo</p>
                        <p className="mt-1 text-sm font-medium">{agent.registered}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="font-medium text-slate-700">Prontidão de exportação</span>
                        <span className="text-slate-500">{agent.readiness}%</span>
                      </div>
                      <Progress value={agent.readiness} className="h-2" />
                    </div>
                  </div>

                  {agent.status === "pending" && (
                    <div className="flex shrink-0 gap-2">
                      <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => updateStatus(agent.id, "approved")}>
                        <CheckCircle2 className="mr-1 h-4 w-4" /> Aprovar
                      </Button>
                      <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50" onClick={() => updateStatus(agent.id, "rejected")}>
                        <XCircle className="mr-1 h-4 w-4" /> Rejeitar
                      </Button>
                    </div>
                  )}

                  {agent.status === "approved" && (
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                      <ShieldCheck className="h-4 w-4" /> Agente verificado
                    </div>
                  )}

                  {agent.status === "rejected" && (
                    <div className="flex items-center gap-2 text-sm font-medium text-red-600">
                      <XCircle className="h-4 w-4" /> Registo rejeitado
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-red-700" />
            <h3 className="mt-4 text-xl font-semibold">Nenhum agente encontrado</h3>
            <p className="mt-2 text-sm text-slate-500">Ajuste os filtros ou aguarde novos registos de agentes.</p>
          </div>
        )}
      </section>
    </main>
  );
}
