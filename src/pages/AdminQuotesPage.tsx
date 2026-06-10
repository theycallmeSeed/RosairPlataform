import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, CheckCircle2, Clock3, MapPin, PackageCheck, Search, Ship, Store, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type QuoteStatus = "pending" | "approved" | "rejected";

type Quote = {
  id: string;
  product: string;
  category: string;
  buyer: string;
  agent: string;
  origin: string;
  destination: string;
  value: string;
  date: string;
  status: QuoteStatus;
};

const initialQuotes: Quote[] = [
  { id: "REQ-001", product: "Commercial Solar Inverter Kits", category: "Energia", buyer: "Comprador Maputo", agent: "Pearl River Export Co.", origin: "Shenzhen, China", destination: "Maputo, Moçambique", value: "USD 9.200", date: "2026-06-08", status: "pending" },
  { id: "REQ-002", product: "Retail Packaging Cartons", category: "Embalagem", buyer: "Comprador Beira", agent: "Ningbo Trade Desk", origin: "Ningbo, China", destination: "Beira, Moçambique", value: "USD 4.200", date: "2026-06-07", status: "pending" },
  { id: "REQ-003", product: "Motorcycle Spare Parts Assortment", category: "Peças Auto", buyer: "Comprador Lusaca", agent: "Guangzhou Mobility Parts", origin: "Guangzhou, China", destination: "Lusaca, Zâmbia", value: "USD 6.400", date: "2026-06-06", status: "approved" },
  { id: "REQ-004", product: "Monocrystalline Solar Panels 550W", category: "Energia", buyer: "Comprador Maputo", agent: "Changzhou Solar Tech", origin: "Changzhou, China", destination: "Maputo, Moçambique", value: "USD 17.500", date: "2026-06-05", status: "rejected" },
  { id: "REQ-005", product: "Bulk Ceramic Floor Tiles 60x60cm", category: "Construção", buyer: "Comprador Nampula", agent: "Foshan Build Materials", origin: "Foshan, China", destination: "Nampula, Moçambique", value: "USD 6.240", date: "2026-06-04", status: "pending" },
  { id: "REQ-006", product: "Rice Milling Machine 1TPH", category: "Agricultura", buyer: "Comprador Quelimane", agent: "Changsha Food Machinery", origin: "Changsha, China", destination: "Quelimane, Moçambique", value: "USD 24.250", date: "2026-06-03", status: "approved" },
];

const statusLabels: Record<QuoteStatus, string> = { pending: "Pendente", approved: "Aprovado", rejected: "Rejeitado" };

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const updateStatus = (id: string, status: QuoteStatus) => {
    setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
  };

  const filtered = quotes.filter((q) => {
    const matchesSearch = search.length === 0 || [q.product, q.buyer, q.agent, q.id].join(" ").toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || q.status === filter;
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
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Gestão de Cotações</Badge>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">Solicitações de Cotação</h1>
          <p className="mt-2 text-slate-600">Revise e gerencie todas as solicitações de cotação dos compradores do marketplace.</p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
              <Search className="h-5 w-5 text-slate-400" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} className="border-0 bg-transparent shadow-none focus-visible:ring-0" placeholder="Pesquisar por produto, comprador, agente..." />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Filtrar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="approved">Aprovadas</SelectItem>
                <SelectItem value="rejected">Rejeitadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <p className="mb-4 text-sm text-slate-500">A mostrar {filtered.length} de {quotes.length} solicitações</p>
        <div className="space-y-4">
          {filtered.map((quote) => (
            <Card key={quote.id} className="border-slate-200 bg-white">
              <CardContent className="p-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-500">{quote.id}</p>
                        <h3 className="mt-1 text-lg font-semibold">{quote.product}</h3>
                      </div>
                      <Badge className={
                        quote.status === "approved" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                        : quote.status === "rejected" ? "bg-red-100 text-red-700 hover:bg-red-100"
                        : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                      }>
                        {statusLabels[quote.status]}
                      </Badge>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <p className="text-xs text-slate-500">Comprador</p>
                        <p className="font-medium">{quote.buyer}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Agente</p>
                        <p className="font-medium">{quote.agent}</p>
                      </div>
                      <div>
                        <p className="flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3 w-3 text-red-700" /> Rota</p>
                        <p className="font-medium">{quote.origin.split(",")[0]} → {quote.destination.split(",")[0]}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Valor</p>
                        <p className="font-bold text-red-700">{quote.value}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                      <Clock3 className="h-4 w-4" /> {quote.date}
                    </div>
                  </div>

                  {quote.status === "pending" && (
                    <div className="flex shrink-0 gap-2">
                      <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => updateStatus(quote.id, "approved")}>
                        <CheckCircle2 className="mr-1 h-4 w-4" /> Aprovar
                      </Button>
                      <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50" onClick={() => updateStatus(quote.id, "rejected")}>
                        <XCircle className="mr-1 h-4 w-4" /> Rejeitar
                      </Button>
                    </div>
                  )}

                  {quote.status === "approved" && (
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" /> Cotação aprovada
                    </div>
                  )}

                  {quote.status === "rejected" && (
                    <div className="flex items-center gap-2 text-sm font-medium text-red-600">
                      <XCircle className="h-4 w-4" /> Cotação rejeitada
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <PackageCheck className="mx-auto h-12 w-12 text-red-700" />
            <h3 className="mt-4 text-xl font-semibold">Nenhuma solicitação encontrada</h3>
            <p className="mt-2 text-sm text-slate-500">Ajuste os filtros ou aguarde novas solicitações de cotação.</p>
          </div>
        )}
      </section>
    </main>
  );
}
