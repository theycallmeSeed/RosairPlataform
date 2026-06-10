import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Boxes, ClipboardList, Clock3, PackagePlus, Ship, ShoppingCart, Store, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { AgentProduct } from "./AgentNewProductPage";

const STORAGE_KEY = "roseair_agent_products";

const defaultProducts: [string, string, string, string][] = [
  ["Commercial Solar Inverter Kits", "Energia", "Pronto para envio", "USD 184"],
  ["Retail Packaging Cartons", "Embalagens", "Ativo", "USD 0.42"],
  ["Industrial Shelving Units", "Armazenagem", "Em produção", "USD 68"],
];

function loadAgentProducts(): AgentProduct[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export default function AgentDashboardPage() {
  const navigate = useNavigate();
  const [agentProducts] = useState(loadAgentProducts);
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
              <Link to="/">Início</Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-300">
              <Link to="/admin">Admin</Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-300">
              <Link to="/buyer">Comprador</Link>
            </Button>
            <Button asChild className="bg-red-700 hover:bg-red-800">
              <Link to="/marketplace">Marketplace</Link>
            </Button>
          </div>
        </div>
      </header>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Painel do Agente</Badge>
          <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Operações do Fornecedor</h1>
              <p className="mt-2 text-slate-600">Gerir ofertas de produtos, consultas recebidas e coordenação logística Roseair.</p>
            </div>
            <Button className="bg-red-700 hover:bg-red-800" onClick={() => navigate("/agent/new-product")}>
              <PackagePlus className="mr-2 h-4 w-4" /> Publicar Produto
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-5 md:grid-cols-4">
          {[
            [Boxes, "Anúncios ativos", "24"],
            [ClipboardList, "Consultas abertas", "18"],
            [Ship, "Encomendas em frete", "7"],
            [TrendingUp, "Conversão de cotações", "31%"],
          ].map(([Icon, label, value]) => {
            const KpiIcon = Icon as typeof Boxes;

            return (
              <Card key={String(label)} className="border-slate-200 bg-white">
                <CardContent className="p-6">
                  <KpiIcon className="h-5 w-5 text-red-700" />
                  <p className="mt-4 text-3xl font-bold">{String(value)}</p>
                  <p className="mt-1 text-sm text-slate-500">{String(label)}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-6 border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-red-700" /> Consultas de Cotação Recebidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { buyer: "Comprador Maputo", product: "Commercial Solar Inverter Kits", qty: 200, date: "2026-06-10", status: "Nova" },
              { buyer: "Comprador Beira", product: "Retail Packaging Cartons", qty: 50000, date: "2026-06-09", status: "Nova" },
              { buyer: "Comprador Matola", product: "Industrial Shelving Units", qty: 480, date: "2026-06-08", status: "Em análise" },
            ].map((req) => (
              <div key={`${req.product}-${req.date}`} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{req.product}</p>
                  <p className="mt-1 text-sm text-slate-500">{req.buyer} • Qtd: {req.qty.toLocaleString()}</p>
                  <p className="flex items-center gap-1 text-xs text-slate-400"><Clock3 className="h-3 w-3" /> {req.date}</p>
                </div>
                <Badge className={req.status === "Nova" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-amber-100 text-amber-700 hover:bg-amber-100"}>{req.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="mt-6 border-slate-200 bg-white">
          <CardHeader>
            <CardTitle>Anúncios de Produtos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {defaultProducts.map(([name, category, status, price]) => (
              <div key={name} className="grid gap-3 rounded-2xl border border-slate-200 p-4 md:grid-cols-[1fr_160px_160px_120px] md:items-center">
                <p className="font-semibold">{name}</p>
                <Badge variant="outline">{category}</Badge>
                <Badge className="bg-red-50 text-red-700 hover:bg-red-50">{status}</Badge>
                <p className="font-bold">{price}</p>
              </div>
            ))}
            {agentProducts.filter((p) => p.status === "publicado").map((product) => (
              <div key={product.id} className="grid gap-3 rounded-2xl border border-emerald-200 p-4 md:grid-cols-[1fr_160px_160px_120px] md:items-center">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{product.id}</p>
                </div>
                <Badge variant="outline">{product.category}</Badge>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">{product.stockStatus}</Badge>
                <p className="font-bold">USD {product.price}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
