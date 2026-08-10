import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, PackageCheck, ShoppingBag } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { products } from "@/data/products";
import { getOrders, orderStatusLabel, type Order, type OrderStatus } from "@/lib/orders";

const SAVED_KEY = "linkano_saved_products";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 10 ? 2 : 0,
  }).format(value);

function loadSaved(): string[] {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) ?? "[]");
  } catch {
    return [];
  }
}

const statusTone = (status: OrderStatus) => {
  if (status === "Delivered") return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
  if (status === "Cancelled") return "bg-brand-100 text-brand-700 hover:bg-brand-100";
  if (status === "PendingPayment") return "bg-gold-100 text-gold-700 hover:bg-gold-100";
  return "bg-brand-50 text-brand-700 hover:bg-brand-50";
};

export default function BuyerDashboardPage() {
  const [saved, setSaved] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setSaved(loadSaved());
    setOrders(getOrders());
  }, []);

  const removeSaved = (id: string) => {
    const next = saved.filter((s) => s !== id);
    setSaved(next);
    localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  };

  const savedProducts = products.filter((p) => saved.includes(p.id));

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <SiteHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Badge className="bg-brand-100 text-brand-800 hover:bg-brand-100">Painel do Comprador</Badge>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">As Minhas Importações</h1>
          <p className="mt-2 text-slate-600">Produtos guardados, encomendas em curso e histórico de compras.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-brand-700" /> As Minhas Encomendas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {orders.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                  <PackageCheck className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-3 font-medium text-slate-500">Ainda não fez nenhuma compra</p>
                  <Button asChild className="mt-4 bg-brand-700 hover:bg-brand-800">
                    <Link to="/">Explorar Marketplace</Link>
                  </Button>
                </div>
              )}
              {orders.map((order) => (
                <Link
                  key={order.id}
                  to={`/orders/${order.id}`}
                  className="block rounded-2xl border border-slate-200 p-4 transition hover:border-brand-200 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{order.orderNumber}</p>
                      <p className="mt-1 text-sm text-slate-500">{order.lines.length} produto(s) • {formatCurrency(order.totalAmount)}</p>
                    </div>
                    <Badge className={statusTone(order.status)}>{orderStatusLabel(order.status)}</Badge>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-brand-700" /> Produtos Guardados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {savedProducts.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                  <Heart className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-3 font-medium text-slate-500">Nenhum produto guardado</p>
                  <Button asChild className="mt-4 bg-brand-700 hover:bg-brand-800">
                    <Link to="/">Explorar Produtos</Link>
                  </Button>
                </div>
              )}
              {savedProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4">
                  <div className="min-w-0 flex-1">
                    <Link to={`/product/${p.id}`} className="font-semibold transition hover:text-brand-700">{p.name}</Link>
                    <p className="mt-1 text-sm text-slate-500">{p.agent} • {p.category}</p>
                  </div>
                  <Button variant="outline" className="shrink-0 border-slate-300" onClick={() => removeSaved(p.id)}>Remover</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        <div className="rounded-2xl bg-brand-50 p-6 text-center">
          <h3 className="text-xl font-semibold text-brand-900">Pronto para encontrar mais fornecedores?</h3>
          <p className="mt-2 text-brand-900/70">Descubra milhares de produtos prontos para importar da China para Moçambique e SADC.</p>
          <Button asChild className="mt-6 bg-brand-700 hover:bg-brand-800">
            <Link to="/">Explorar Marketplace</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
