import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock3, Heart, PackageCheck, ShoppingCart, Store } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { products } from "@/data/products";

const SAVED_KEY = "roseair_saved_products";
const QUOTES_KEY = "roseair_quote_history";

type QuoteRecord = {
  productId: string;
  quantity: number;
  date: string;
};

function loadSaved(): string[] {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function loadQuotes(): QuoteRecord[] {
  try {
    return JSON.parse(localStorage.getItem(QUOTES_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export default function BuyerDashboardPage() {
  const [saved, setSaved] = useState<string[]>([]);
  const [quotes, setQuotes] = useState<QuoteRecord[]>([]);

  useEffect(() => {
    setSaved(loadSaved());
    setQuotes(loadQuotes());
  }, []);

  const removeSaved = (id: string) => {
    const next = saved.filter((s) => s !== id);
    setSaved(next);
    localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  };

  const savedProducts = products.filter((p) => saved.includes(p.id));

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
              <Link to="/agent">Agente</Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-300">
              <Link to="/admin">Admin</Link>
            </Button>
            <Button asChild className="bg-red-700 hover:bg-red-800">
              <Link to="/marketplace">Marketplace</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Painel do Comprador</Badge>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">As Minhas Importações</h1>
          <p className="mt-2 text-slate-600">Produtos guardados, cotações solicitadas e histórico de importação.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-700" /> Produtos Guardados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {savedProducts.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                  <Heart className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-3 font-medium text-slate-500">Nenhum produto guardado</p>
                  <Button asChild className="mt-4 bg-red-700 hover:bg-red-800">
                    <Link to="/marketplace">Explorar Produtos</Link>
                  </Button>
                </div>
              )}
              {savedProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4">
                  <div className="min-w-0 flex-1">
                    <Link to={`/product/${p.id}`} className="font-semibold transition hover:text-red-700">{p.name}</Link>
                    <p className="mt-1 text-sm text-slate-500">{p.agent} • {p.category}</p>
                  </div>
                  <Button variant="outline" className="shrink-0 border-slate-300" onClick={() => removeSaved(p.id)}>Remover</Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-red-700" /> Histórico de Cotações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quotes.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                  <PackageCheck className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-3 font-medium text-slate-500">Nenhuma cotação solicitada</p>
                  <Button asChild className="mt-4 bg-red-700 hover:bg-red-800">
                    <Link to="/marketplace">Solicitar Cotação</Link>
                  </Button>
                </div>
              )}
              {quotes.map((q, i) => {
                const p = products.find((x) => x.id === q.productId);
                return (
                  <div key={`${q.productId}-${i}`} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link to={`/product/${q.productId}`} className="font-semibold transition hover:text-red-700">{p?.name ?? q.productId}</Link>
                        <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                          <Clock3 className="h-3 w-3" /> {q.date}
                        </p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pendente</Badge>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">Qtd: {q.quantity.toLocaleString()} {p?.unit ?? "unidade(s)"}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        <div className="rounded-2xl bg-red-50 p-6 text-center">
          <h3 className="text-xl font-semibold text-red-900">Pronto para encontrar mais fornecedores?</h3>
          <p className="mt-2 text-red-900/70">Descubra milhares de produtos prontos para importar da China para Moçambique e SADC.</p>
          <Button asChild className="mt-6 bg-red-700 hover:bg-red-800">
            <Link to="/marketplace">Explorar Marketplace</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
