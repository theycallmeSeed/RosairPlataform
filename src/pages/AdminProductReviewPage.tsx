import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, PackageCheck, Search, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { agentProductStatusLabel, approveAgentProduct, loadAgentProducts, rejectAgentProduct, type AgentProduct } from "@/lib/agentProducts";

const statusTone: Record<AgentProduct["status"], string> = {
  Draft: "bg-slate-100 text-slate-600 hover:bg-slate-100",
  Submitted: "bg-gold-100 text-gold-700 hover:bg-gold-100",
  Published: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  Rejected: "bg-brand-100 text-brand-700 hover:bg-brand-100",
};

/**
 * Product/Price approval queue (business-rules.md §4). Agents cannot self-publish (BR-PRD-01);
 * this mock collapses the Pricing Engine sub-workflow (pricing-engine.md) into a single
 * Admin approve/reject decision, since there is no backend pricing service here.
 */
export default function AdminProductReviewPage() {
  const [products, setProducts] = useState<AgentProduct[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Submitted");
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const refresh = () => setProducts(loadAgentProducts());
  useEffect(() => { refresh(); }, []);

  const filtered = products.filter((p) => {
    const matchesSearch = search.length === 0 || [p.name, p.category, p.brand, p.id].join(" ").toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleApprove = (id: string) => {
    approveAgentProduct(id);
    refresh();
  };

  const handleConfirmReject = (id: string) => {
    if (!reason.trim()) return;
    rejectAgentProduct(id, reason.trim());
    setRejecting(null);
    setReason("");
    refresh();
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-base font-black text-white shadow-sm">
              L
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">Linkano</p>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-brand-600">Powered by Linkano</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="border-slate-300">
              <Link to="/admin">Painel de Admin</Link>
            </Button>
            <Button asChild className="bg-brand-700 hover:bg-brand-800">
              <Link to="/">Marketplace</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Badge className="bg-brand-100 text-brand-800 hover:bg-brand-100">Aprovação de Produtos</Badge>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">Revisão de Produtos e Preços</h1>
          <p className="mt-2 text-slate-600">Reveja os produtos submetidos pelos agentes antes de calcularem o preço final e ficarem visíveis no marketplace.</p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
              <Search className="h-5 w-5 text-slate-400" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} className="border-0 bg-transparent shadow-none focus-visible:ring-0" placeholder="Pesquisar por produto, marca, categoria..." />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="Filtrar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Submitted">Aguardam Aprovação</SelectItem>
                <SelectItem value="Published">Publicados</SelectItem>
                <SelectItem value="Rejected">Rejeitados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <p className="mb-4 text-sm text-slate-500">A mostrar {filtered.length} de {products.length} produtos</p>
        <div className="space-y-4">
          {filtered.map((product) => (
            <Card key={product.id} className="border-slate-200 bg-white">
              <CardContent className="p-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-500">{product.id}</p>
                        <h3 className="mt-1 text-lg font-semibold">{product.name}</h3>
                      </div>
                      <Badge className={statusTone[product.status]}>{agentProductStatusLabel[product.status]}</Badge>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <p className="text-xs text-slate-500">Categoria</p>
                        <p className="font-medium">{product.category}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Marca / Modelo</p>
                        <p className="font-medium">{product.brand} {product.model}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Custo de Fornecedor</p>
                        <p className="font-bold text-brand-700">USD {product.supplierCost}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">MOQ</p>
                        <p className="font-medium">{product.moq.toLocaleString()}</p>
                      </div>
                    </div>

                    {rejecting === product.id && (
                      <div className="mt-4 space-y-2 rounded-xl border border-brand-200 bg-brand-50 p-3">
                        <label className="text-xs font-medium text-brand-800">Motivo da rejeição (obrigatório)</label>
                        <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ex: documentação incompleta, especificações insuficientes..." />
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-brand-700 hover:bg-brand-800" onClick={() => handleConfirmReject(product.id)} disabled={!reason.trim()}>Confirmar Rejeição</Button>
                          <Button size="sm" variant="outline" onClick={() => { setRejecting(null); setReason(""); }}>Cancelar</Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {product.status === "Submitted" && rejecting !== product.id && (
                    <div className="flex shrink-0 gap-2">
                      <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleApprove(product.id)}>
                        <CheckCircle2 className="mr-1 h-4 w-4" /> Aprovar e Publicar
                      </Button>
                      <Button variant="outline" className="border-brand-300 text-brand-700 hover:bg-brand-50" onClick={() => setRejecting(product.id)}>
                        <XCircle className="mr-1 h-4 w-4" /> Rejeitar
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <PackageCheck className="mx-auto h-12 w-12 text-brand-700" />
            <h3 className="mt-4 text-xl font-semibold">Nenhum produto encontrado</h3>
            <p className="mt-2 text-sm text-slate-500">Ajuste os filtros ou aguarde novas submissões dos agentes.</p>
          </div>
        )}
      </section>
    </main>
  );
}
