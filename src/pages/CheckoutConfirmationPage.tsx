import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock3, MessageCircle, PackageCheck, Receipt } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { getInvoiceForOrder, getOrderById, type Order } from "@/lib/orders";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 10 ? 2 : 0,
  }).format(value);

/**
 * Purchase -> Payment -> Invoice Generation -> Checkout Confirmation (business.md §5).
 * Replaces the old QuoteRequestSuccessPage — there is no "waiting for a formal
 * quotation" step; the order is real and already priced.
 */
export default function CheckoutConfirmationPage() {
  const [params] = useSearchParams();
  const orderId = params.get("order") ?? "";
  const [order, setOrder] = useState<Order | undefined>(undefined);

  useEffect(() => {
    setOrder(getOrderById(orderId));
  }, [orderId]);

  if (!order) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-950">
        <SiteHeader />
        <section className="mx-auto max-w-3xl px-6 py-20 text-center">
          <Badge className="bg-brand-100 text-brand-800 hover:bg-brand-100">Encomenda não encontrada</Badge>
          <h1 className="mt-6 text-3xl font-bold tracking-tight">Não foi possível encontrar esta encomenda</h1>
          <Button asChild className="mt-8 bg-brand-700 hover:bg-brand-800">
            <Link to="/">Voltar ao Marketplace</Link>
          </Button>
        </section>
      </main>
    );
  }

  const invoice = getInvoiceForOrder(order);
  const isPending = order.status === "PendingPayment";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <SiteHeader />

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${isPending ? "bg-gold-100" : "bg-emerald-100"}`}>
          {isPending ? <Clock3 className="h-10 w-10 text-gold-600" /> : <CheckCircle2 className="h-10 w-10 text-emerald-600" />}
        </div>
        <Badge className={`mt-6 ${isPending ? "bg-gold-100 text-gold-700 hover:bg-gold-100" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"}`}>
          {isPending ? "Aguarda Confirmação de Pagamento" : "Compra Confirmada"}
        </Badge>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          {isPending ? "Encomenda registada" : "A sua encomenda foi confirmada"}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
          {isPending
            ? "Envie o comprovativo de transferência bancária. A Linkano confirma o pagamento manualmente e a encomenda avança automaticamente."
            : "O pagamento foi confirmado. A Linkano já está a coordenar a operação com o(s) agente(s) responsáveis."}
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-12">
        <Card className="border-emerald-100 bg-white shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-brand-700" /> Factura {invoice.invoiceNumber}
              <Badge variant="outline" className="ml-auto text-[10px]">{invoice.status === "Finalized" ? "Final" : "Pró-forma"}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">Número da Encomenda</p>
              <p className="mt-1 font-semibold">{order.orderNumber}</p>
            </div>

            <div className="space-y-2">
              {invoice.lines.map((line) => (
                <div key={line.productId} className="flex justify-between rounded-xl border border-slate-100 p-3 text-sm">
                  <div>
                    <p className="font-medium">{line.productName}</p>
                    <p className="text-xs text-slate-400">{line.agent} • {line.quantity.toLocaleString()} un.</p>
                  </div>
                  <p className="font-semibold">{formatCurrency(line.lineTotal)}</p>
                </div>
              ))}
            </div>

            <Separator />
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total Pago</span>
              <span className="text-2xl font-bold text-brand-700">{formatCurrency(invoice.totalAmount)}</span>
            </div>
            <p className="text-sm text-slate-500">Método de pagamento: <span className="font-medium text-slate-800">{order.paymentMethod}</span></p>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="font-semibold">Próximos Passos</p>
              <ol className="mt-4 space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">1</span>
                  {isPending ? "A Linkano confirma o pagamento após validar o comprovativo" : "O(s) agente(s) prepara(m) o envio dos produtos"}
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">2</span>
                  Pode coordenar directamente com o agente via chat — a Linkano supervisiona a conversa
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">3</span>
                  Acompanhe o estado do envio: frete, chegada ao porto e desalfandegamento
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">4</span>
                  Recebe a encomenda no destino final
                </li>
              </ol>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="flex-1 bg-brand-700 hover:bg-brand-800">
                <Link to={`/orders/${order.id}`}><PackageCheck className="mr-2 h-4 w-4" /> Ver Encomenda e Rastreio</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 border-slate-300">
                <Link to={`/orders/${order.id}`}><MessageCircle className="mr-2 h-4 w-4" /> Falar com o Agente</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 border-slate-300">
                <Link to="/">Continuar a Comprar</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
