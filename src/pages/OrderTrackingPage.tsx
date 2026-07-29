import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, MessageCircle, PackageCheck, Send, ShieldCheck } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { getMessagesForOrder, sendMessage, type ChatMessage } from "@/lib/chat";
import { ORDER_STAGES, getOrderById, type Order } from "@/lib/orders";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 10 ? 2 : 0,
  }).format(value);

const formatDate = (iso: string) => new Date(iso).toLocaleString("pt-PT", { dateStyle: "medium", timeStyle: "short" });

export default function OrderTrackingPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!id) return;
    setOrder(getOrderById(id));
    setMessages(getMessagesForOrder(id));
  }, [id]);

  if (!order) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-950">
        <SiteHeader />
        <section className="mx-auto max-w-3xl px-6 py-20 text-center">
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Encomenda não encontrada</Badge>
          <h1 className="mt-6 text-3xl font-bold tracking-tight">Esta encomenda não existe</h1>
          <Button asChild className="mt-8 bg-red-700 hover:bg-red-800">
            <Link to="/buyer">Voltar às Minhas Encomendas</Link>
          </Button>
        </section>
      </main>
    );
  }

  const currentIndex = order.status === "Cancelled" ? -1 : ORDER_STAGES.findIndex((s) => s.status === order.status);
  const agents = Array.from(new Set(order.lines.map((l) => l.agent)));

  const handleSend = () => {
    if (!draft.trim() || !id) return;
    sendMessage(id, "buyer", draft.trim());
    setMessages(getMessagesForOrder(id));
    setDraft("");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <SiteHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Button asChild variant="ghost" className="mb-4 text-red-700 hover:bg-red-50 hover:text-red-800">
            <Link to="/buyer"><ArrowLeft className="mr-2 h-4 w-4" /> Minhas Encomendas</Link>
          </Button>
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{order.orderNumber}</Badge>
            {order.isDisputed && <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Em Disputa</Badge>}
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">
            {order.status === "Cancelled" ? "Encomenda Cancelada" : "Acompanhamento da Encomenda"}
          </h1>
          <p className="mt-2 text-slate-600">Agente(s) responsável(is): {agents.join(", ")}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="space-y-6">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><PackageCheck className="h-5 w-5 text-red-700" /> Estado do Envio</CardTitle>
            </CardHeader>
            <CardContent>
              {order.status === "Cancelled" ? (
                <p className="text-sm text-slate-500">Esta encomenda foi cancelada.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {ORDER_STAGES.map((stage, index) => {
                    const done = index <= currentIndex;
                    return (
                      <div key={stage.status} className={`rounded-2xl border p-4 ${done ? "border-emerald-200 bg-emerald-50" : "border-slate-200"}`}>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className={`h-4 w-4 ${done ? "text-emerald-600" : "text-slate-300"}`} />
                          <span className={`text-xs font-semibold ${done ? "text-emerald-700" : "text-slate-400"}`}>Etapa {index + 1}</span>
                        </div>
                        <p className={`mt-2 text-sm font-semibold ${done ? "text-slate-900" : "text-slate-400"}`}>{stage.label}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle>Histórico</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[...order.trackingEvents].reverse().map((event, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 text-sm">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-700" />
                  <div>
                    <p className="font-medium">{event.label}</p>
                    <p className="text-xs text-slate-400">{formatDate(event.occurredAt)}</p>
                    {event.note && <p className="mt-1 text-xs text-slate-500">{event.note}</p>}
                  </div>
                </div>
              ))}
              {order.trackingEvents.length === 0 && <p className="text-sm text-slate-500">Ainda sem eventos registados.</p>}
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-red-700" /> Chat com o Agente
                <Badge variant="outline" className="ml-auto flex items-center gap-1 text-[10px]"><ShieldCheck className="h-3 w-3" /> Supervisionado pela Roseair</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {messages.length === 0 && <p className="text-sm text-slate-500">Ainda não há mensagens. Coordene aqui a preparação do seu envio.</p>}
                {messages.map((m) => (
                  <div key={m.id} className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${m.sender === "buyer" ? "ml-auto bg-red-700 text-white" : "bg-slate-100 text-slate-800"}`}>
                    <p>{m.body}</p>
                    <p className={`mt-1 text-[10px] ${m.sender === "buyer" ? "text-red-100" : "text-slate-400"}`}>{formatDate(m.sentAt)}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="Escreva uma mensagem sobre especificações, envio ou documentação..." />
                <Button className="bg-red-700 hover:bg-red-800" onClick={handleSend}><Send className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 bg-white lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle>Itens da Encomenda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {order.lines.map((line) => (
              <div key={line.productId} className="flex justify-between rounded-xl border border-slate-100 p-3 text-sm">
                <div>
                  <p className="font-medium">{line.productName}</p>
                  <p className="text-xs text-slate-400">{line.agent} • {line.quantity.toLocaleString()} un.</p>
                </div>
                <p className="font-semibold">{formatCurrency(line.lineTotal)}</p>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-sm font-semibold">Total</span>
              <span className="text-lg font-bold text-red-700">{formatCurrency(order.totalAmount)}</span>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
