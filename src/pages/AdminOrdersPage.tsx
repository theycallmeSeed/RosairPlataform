import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Banknote, CheckCircle2, PackageCheck, Search, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { cancelOrder, confirmBankTransferPayment, getOrders, orderStatusLabel, type Order } from "@/lib/orders";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

const statusTone = (status: Order["status"]) => {
  if (status === "Delivered") return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
  if (status === "Cancelled") return "bg-red-100 text-red-700 hover:bg-red-100";
  if (status === "PendingPayment") return "bg-amber-100 text-amber-700 hover:bg-amber-100";
  return "bg-red-50 text-red-700 hover:bg-red-50";
};

/** Order management + Bank Transfer manual reconciliation (BR-PAY-05, business-rules.md §6). */
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const refresh = () => setOrders(getOrders());
  useEffect(() => { refresh(); }, []);

  const filtered = orders.filter((o) => {
    const matchesSearch = search.length === 0 || [o.orderNumber, ...o.lines.map((l) => l.productName), ...o.lines.map((l) => l.agent)].join(" ").toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || o.status === filter;
    return matchesSearch && matchesFilter;
  });

  const pendingBankTransfers = orders.filter((o) => o.status === "PendingPayment" && o.paymentMethod === "Transferência Bancária").length;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-base font-black text-white shadow-sm">
              L
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">Linkano</p>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-orange-600">Powered by Roseair</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="border-slate-300">
              <Link to="/admin">Painel de Admin</Link>
            </Button>
            <Button asChild className="bg-red-700 hover:bg-red-800">
              <Link to="/">Marketplace</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Encomendas & Pagamentos</Badge>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">Gestão de Encomendas</h1>
          <p className="mt-2 text-slate-600">
            Supervisione todas as encomendas da plataforma e reconcilie manualmente pagamentos por transferência bancária.
            {pendingBankTransfers > 0 && <span className="ml-1 font-semibold text-amber-700">{pendingBankTransfers} aguardam confirmação.</span>}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
              <Search className="h-5 w-5 text-slate-400" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} className="border-0 bg-transparent shadow-none focus-visible:ring-0" placeholder="Pesquisar por nº de encomenda, produto, agente..." />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="Filtrar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                <SelectItem value="PendingPayment">Pagamento Pendente</SelectItem>
                <SelectItem value="PaymentConfirmed">Pagamento Confirmado</SelectItem>
                <SelectItem value="PreparingShipment">A Preparar Envio</SelectItem>
                <SelectItem value="Shipped">Enviado</SelectItem>
                <SelectItem value="TrackingActive">Em Trânsito</SelectItem>
                <SelectItem value="ArrivedAtPort">Chegou ao Porto</SelectItem>
                <SelectItem value="CustomsClearance">Desalfandegamento</SelectItem>
                <SelectItem value="Delivered">Entregue</SelectItem>
                <SelectItem value="Cancelled">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <p className="mb-4 text-sm text-slate-500">A mostrar {filtered.length} de {orders.length} encomendas</p>
        <div className="space-y-4">
          {filtered.map((order) => (
            <Card key={order.id} className="border-slate-200 bg-white">
              <CardContent className="p-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-500">{order.orderNumber}</p>
                        <h3 className="mt-1 text-lg font-semibold">{order.lines.map((l) => l.productName).join(", ")}</h3>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className={statusTone(order.status)}>{orderStatusLabel(order.status)}</Badge>
                        {order.isDisputed && <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Em Disputa</Badge>}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <p className="text-xs text-slate-500">Agente(s)</p>
                        <p className="font-medium">{Array.from(new Set(order.lines.map((l) => l.agent))).join(", ")}</p>
                      </div>
                      <div>
                        <p className="flex items-center gap-1 text-xs text-slate-500"><Banknote className="h-3 w-3 text-red-700" /> Método</p>
                        <p className="font-medium">{order.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Total</p>
                        <p className="font-bold text-red-700">{formatCurrency(order.totalAmount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Criada em</p>
                        <p className="font-medium">{new Date(order.createdAt).toLocaleDateString("pt-PT")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col gap-2">
                    <Button asChild variant="outline" className="border-slate-300">
                      <Link to={`/orders/${order.id}`}>Ver Detalhes</Link>
                    </Button>
                    {order.status === "PendingPayment" && order.paymentMethod === "Transferência Bancária" && (
                      <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => { confirmBankTransferPayment(order.id); refresh(); }}>
                        <CheckCircle2 className="mr-1 h-4 w-4" /> Confirmar Pagamento
                      </Button>
                    )}
                    {order.status === "PendingPayment" && (
                      <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50" onClick={() => { cancelOrder(order.id, "Cancelada pela administração"); refresh(); }}>
                        <XCircle className="mr-1 h-4 w-4" /> Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <PackageCheck className="mx-auto h-12 w-12 text-red-700" />
            <h3 className="mt-4 text-xl font-semibold">Nenhuma encomenda encontrada</h3>
            <p className="mt-2 text-sm text-slate-500">Ajuste os filtros ou aguarde novas compras no marketplace.</p>
          </div>
        )}
      </section>
    </main>
  );
}
