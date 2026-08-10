import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, PackageCheck, ShoppingCart, Trash2 } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { getCartWithProducts, removeFromCart, updateCartQuantity, type CartLineWithProduct } from "@/lib/cart";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 10 ? 2 : 0,
  }).format(value);

export default function CartPage() {
  const navigate = useNavigate();
  const [lines, setLines] = useState<CartLineWithProduct[]>([]);

  useEffect(() => {
    setLines(getCartWithProducts());
  }, []);

  const refresh = () => setLines(getCartWithProducts());

  const total = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
  const agentGroups = Array.from(new Set(lines.map((l) => l.product.agent)));

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <SiteHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Button asChild variant="ghost" className="mb-4 text-brand-700 hover:bg-brand-50 hover:text-brand-800">
            <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Continuar a Comprar</Link>
          </Button>
          <Badge className="bg-brand-100 text-brand-800 hover:bg-brand-100">Carrinho</Badge>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">O Meu Carrinho</h1>
          {lines.length > 0 && (
            <p className="mt-2 text-slate-600">
              {lines.length} produto(s) de {agentGroups.length} agente(s) — cada agente será tratado como um envio separado.
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        {lines.length === 0 ? (
          <Card className="border-dashed border-slate-300 bg-white">
            <CardContent className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <ShoppingCart className="h-12 w-12 text-brand-700" />
              <h3 className="mt-4 text-xl font-semibold">O seu carrinho está vazio</h3>
              <p className="mt-2 max-w-md text-sm text-slate-500">Explore o marketplace e adicione produtos prontos para importar.</p>
              <Button asChild className="mt-6 bg-brand-700 hover:bg-brand-800">
                <Link to="/">Explorar Marketplace</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
            <div className="space-y-4">
              {agentGroups.map((agent) => (
                <Card key={agent} className="border-slate-200 bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-500">Agente: <span className="text-slate-950">{agent}</span></CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {lines.filter((l) => l.product.agent === agent).map((line) => (
                      <div key={line.productId} className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4">
                        <img src={line.product.imageUrl} alt={line.product.name} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                        <div className="min-w-0 flex-1">
                          <Link to={`/product/${line.productId}`} className="line-clamp-1 font-semibold hover:text-brand-700">{line.product.name}</Link>
                          <p className="mt-1 text-sm text-slate-500">{formatCurrency(line.product.price)} / {line.product.unit}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-300 text-sm font-semibold hover:border-brand-300 hover:text-brand-700"
                              onClick={() => {
                                updateCartQuantity(line.productId, Math.max(line.product.moq, line.quantity - line.product.moq));
                                refresh();
                              }}
                            >−</button>
                            <span className="min-w-[3rem] text-center text-sm font-bold tabular-nums">{line.quantity.toLocaleString()}</span>
                            <button
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-300 text-sm font-semibold hover:border-brand-300 hover:text-brand-700"
                              onClick={() => {
                                updateCartQuantity(line.productId, line.quantity + line.product.moq);
                                refresh();
                              }}
                            >+</button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-brand-700">{formatCurrency(line.product.price * line.quantity)}</p>
                          <button
                            className="mt-2 inline-flex items-center gap-1 text-xs text-slate-400 hover:text-brand-700"
                            onClick={() => {
                              removeFromCart(line.productId);
                              refresh();
                            }}
                          >
                            <Trash2 className="h-3 w-3" /> Remover
                          </button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-brand-100 bg-white lg:sticky lg:top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><PackageCheck className="h-5 w-5 text-brand-700" /> Resumo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium">{formatCurrency(total)}</span>
                </div>
                <p className="text-xs text-slate-400">Frete, desalfandegamento e comissão Linkano já incluídos no preço de cada produto.</p>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Total a Pagar</span>
                  <span className="text-xl font-bold text-brand-700">{formatCurrency(total)}</span>
                </div>
                <Button className="w-full bg-brand-700 hover:bg-brand-800" onClick={() => navigate("/checkout")}>
                  Prosseguir para Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </section>
    </main>
  );
}
