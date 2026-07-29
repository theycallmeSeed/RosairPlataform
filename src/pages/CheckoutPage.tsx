import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Banknote, Building2, Landmark, Smartphone } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { getCartWithProducts, type CartLineWithProduct } from "@/lib/cart";
import { createOrderFromCart, type PaymentMethod } from "@/lib/orders";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 10 ? 2 : 0,
  }).format(value);

const paymentOptions: { method: PaymentMethod; label: string; description: string; icon: typeof Smartphone }[] = [
  { method: "M-Pesa", label: "M-Pesa", description: "Confirmação instantânea via M-Pesa.", icon: Smartphone },
  { method: "e-Mola", label: "e-Mola", description: "Confirmação instantânea via e-Mola.", icon: Banknote },
  { method: "Transferência Bancária", label: "Transferência Bancária", description: "Requer confirmação manual da Roseair após envio do comprovativo.", icon: Landmark },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [lines, setLines] = useState<CartLineWithProduct[]>([]);
  const [method, setMethod] = useState<PaymentMethod>("M-Pesa");
  const [address, setAddress] = useState({ company: "", city: "", street: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLines(getCartWithProducts());
  }, []);

  const total = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
  const isAddressValid = address.company && address.city && address.street && address.phone;

  const handleConfirm = () => {
    if (lines.length === 0 || !isAddressValid) return;
    setSubmitting(true);
    const order = createOrderFromCart(lines, method);
    navigate(`/checkout/confirmation?order=${order.id}`);
  };

  if (lines.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-950">
        <SiteHeader />
        <section className="mx-auto max-w-3xl px-6 py-20 text-center">
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Checkout</Badge>
          <h1 className="mt-6 text-3xl font-bold tracking-tight">O seu carrinho está vazio</h1>
          <p className="mt-4 text-slate-600">Adicione produtos ao carrinho antes de avançar para o checkout.</p>
          <Button asChild className="mt-8 bg-red-700 hover:bg-red-800">
            <Link to="/">Explorar Marketplace</Link>
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <SiteHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Button asChild variant="ghost" className="mb-4 text-red-700 hover:bg-red-50 hover:text-red-800">
            <Link to="/cart"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Carrinho</Link>
          </Button>
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Checkout</Badge>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">Finalizar Compra</h1>
          <p className="mt-2 text-slate-600">O pagamento é sempre efectuado à Roseair — nunca directamente ao agente.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1fr_380px] lg:items-start">
        <div className="space-y-6">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5 text-red-700" /> Dados de Entrega</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Empresa / Nome do Comprador *</label>
                <Input value={address.company} onChange={(e) => setAddress({ ...address, company: e.target.value })} placeholder="Ex: Comprador Maputo, Lda." />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Cidade *</label>
                <Input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="Ex: Maputo" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Telefone *</label>
                <Input value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} placeholder="Ex: 84 000 0000" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Morada de Entrega *</label>
                <Input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} placeholder="Endereço completo para entrega final" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle>Método de Pagamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {paymentOptions.map(({ method: m, label, description, icon: Icon }) => (
                <label
                  key={m}
                  className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition ${
                    method === m ? "border-red-300 bg-red-50" : "border-slate-200 hover:border-red-200"
                  }`}
                >
                  <input type="radio" name="payment" className="mt-1 h-4 w-4 accent-red-700" checked={method === m} onChange={() => setMethod(m)} />
                  <Icon className="mt-0.5 h-5 w-5 text-red-700" />
                  <div>
                    <p className="font-semibold">{label}</p>
                    <p className="text-sm text-slate-500">{description}</p>
                  </div>
                </label>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="border-red-100 bg-white lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle>Resumo da Encomenda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {lines.map((line) => (
                <div key={line.productId} className="flex justify-between text-sm">
                  <span className="max-w-[200px] truncate text-slate-600">{line.product.name} × {line.quantity.toLocaleString()}</span>
                  <span className="font-medium">{formatCurrency(line.product.price * line.quantity)}</span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Total a Pagar</span>
              <span className="text-xl font-bold text-red-700">{formatCurrency(total)}</span>
            </div>
            <Button className="w-full bg-red-700 hover:bg-red-800" disabled={!isAddressValid || submitting} onClick={handleConfirm}>
              Confirmar e Pagar
            </Button>
            <p className="text-xs text-slate-400">Ao confirmar, a Roseair gera a factura e inicia a coordenação com o(s) agente(s) responsáveis.</p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
