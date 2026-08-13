import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Boxes, Clock3, PackagePlus, Ship, ShoppingBag, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { agentProductStatusLabel, loadAgentProducts, type AgentProduct } from "@/lib/agentProducts";
import { advanceOrderStatus, getOrders, ORDER_STAGES, orderStatusLabel, type Order } from "@/lib/orders";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

const statusTone: Record<AgentProduct["status"], string> = {
  Draft: "bg-slate-100 text-slate-600 hover:bg-slate-100",
  Submitted: "bg-gold-100 text-gold-700 hover:bg-gold-100",
  Published: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  Rejected: "bg-brand-100 text-brand-700 hover:bg-brand-100",
};

/** Next fulfillment action an Agent can take on an order not yet Delivered/Cancelled (BR-ORD-01: strictly forward). */
function nextAgentAction(order: Order): { status: Order["status"]; label: string } | null {
  const index = ORDER_STAGES.findIndex((s) => s.status === order.status);
  if (index === -1 || index === ORDER_STAGES.length - 1) return null;
  const next = ORDER_STAGES[index + 1];
  return { status: next.status, label: `Avançar para: ${next.label}` };
}

export default function AgentDashboardPage() {
  const navigate = useNavigate();
  const [agentProducts, setAgentProducts] = useState<AgentProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const refresh = () => {
    setAgentProducts(loadAgentProducts());
    setOrders(getOrders());
  };

  useEffect(() => {
    refresh();
  }, []);

  const publishedCount = agentProducts.filter((p) => p.status === "Published").length;
  const pendingCount = agentProducts.filter((p) => p.status === "Submitted").length;
  const shippingCount = orders.filter((o) => ["PreparingShipment", "Shipped", "TrackingActive", "ArrivedAtPort", "CustomsClearance"].includes(o.status)).length;

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
              <Link to="/">Início</Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-300">
              <Link to="/admin">Admin</Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-300">
              <Link to="/buyer">Comprador</Link>
            </Button>
            <Button asChild className="bg-brand-700 hover:bg-brand-800">
              <Link to="/">Marketplace</Link>
            </Button>
          </div>
        </div>
      </header>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Badge className="bg-brand-100 text-brand-800 hover:bg-brand-100">Painel do Agente</Badge>
          <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Operações do Agente</h1>
              <p className="mt-2 text-slate-600">Gerir produtos submetidos à Linkano, encomendas recebidas e coordenação logística.</p>
            </div>
            <Button className="bg-brand-700 hover:bg-brand-800" onClick={() => navigate("/agent/new-product")}>
              <PackagePlus className="mr-2 h-4 w-4" /> Submeter Produto
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-5 md:grid-cols-4">
          {[
            [Boxes, "Produtos publicados", String(publishedCount)],
            [Clock3, "Aguardam aprovação Linkano", String(pendingCount)],
            [Ship, "Encomendas em envio", String(shippingCount)],
            [TrendingUp, "Encomendas totais", String(orders.length)],
          ].map(([Icon, label, value]) => {
            const KpiIcon = Icon as typeof Boxes;

            return (
              <Card key={String(label)} className="border-slate-200 bg-white">
                <CardContent className="p-6">
                  <KpiIcon className="h-5 w-5 text-brand-700" />
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
              <ShoppingBag className="h-5 w-5 text-brand-700" /> Encomendas Recebidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {orders.length === 0 && <p className="text-sm text-slate-500">Ainda sem encomendas.</p>}
            {orders.map((order) => {
              const action = nextAgentAction(order);
              return (
                <div key={order.id} className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{order.orderNumber}</p>
                      <Badge variant="outline" className="text-[10px]">{orderStatusLabel(order.status)}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{order.lines.map((l) => l.productName).join(", ")}</p>
                    <p className="flex items-center gap-1 text-xs text-slate-400"><Clock3 className="h-3 w-3" /> {new Date(order.createdAt).toLocaleDateString("pt-PT")} • {formatCurrency(order.totalAmount)}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button asChild variant="outline" className="border-slate-300">
                      <Link to={`/orders/${order.id}`}>Ver / Chat</Link>
                    </Button>
                    {action && order.status !== "PendingPayment" && (
                      <Button
                        className="bg-brand-700 hover:bg-brand-800"
                        onClick={() => {
                          advanceOrderStatus(order.id, action.status);
                          refresh();
                        }}
                      >
                        {action.label}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="mt-6 border-slate-200 bg-white">
          <CardHeader>
            <CardTitle>Os Meus Produtos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {agentProducts.length === 0 && <p className="text-sm text-slate-500">Ainda não submeteu nenhum produto.</p>}
            {agentProducts.map((product) => (
              <div key={product.id} className="grid gap-3 rounded-2xl border border-slate-200 p-4 md:grid-cols-[1fr_160px_200px_120px] md:items-center">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{product.id}</p>
                  {product.status === "Rejected" && product.rejectionReason && (
                    <p className="mt-1 text-xs text-brand-600">Motivo: {product.rejectionReason}</p>
                  )}
                </div>
                <Badge variant="outline">{product.category}</Badge>
                <Badge className={statusTone[product.status]}>{agentProductStatusLabel[product.status]}</Badge>
                <p className="font-bold">Custo: USD {product.supplierCost}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
