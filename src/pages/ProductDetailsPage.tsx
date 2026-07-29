import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Boxes, CheckCircle2, ClipboardCheck, MapPin, PackageCheck, ShieldCheck, Ship, Warehouse } from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import { products } from "@/data/products";
import { addToCart } from "@/lib/cart";

const SAVED_KEY = "roseair_saved_products";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 10 ? 2 : 0,
  }).format(value);

function isSaved(productId: string): boolean {
  try {
    return (JSON.parse(localStorage.getItem(SAVED_KEY) ?? "[]") as string[]).includes(productId);
  } catch {
    return false;
  }
}

function toggleSaved(productId: string): boolean {
  const current: string[] = JSON.parse(localStorage.getItem(SAVED_KEY) ?? "[]");
  const exists = current.includes(productId);
  const next = exists ? current.filter((id) => id !== productId) : [...current, productId];
  localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  return !exists;
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [qty, setQty] = useState(0);
  const product = products.find((p) => p.id === id);

  useEffect(() => {
    if (id) setSaved(isSaved(id));
  }, [id]);

  useEffect(() => {
    if (product) setQty(product.moq);
  }, [product]);

  if (!product) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-950">
        <section className="mx-auto max-w-7xl px-6 py-20 text-center">
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Produto não encontrado</Badge>
          <h1 className="mt-6 text-4xl font-bold tracking-tight">Produto não disponível</h1>
          <p className="mt-4 text-slate-600">O produto que procura não existe ou foi removido.</p>
          <Button asChild className="mt-8 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
            <Link to="/marketplace">Voltar ao Marketplace</Link>
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
          <Button asChild variant="ghost" className="mb-6 text-orange-600 hover:bg-orange-50 hover:text-orange-700">
            <Link to="/marketplace">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Marketplace
            </Link>
          </Button>
          <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
            <div>
              <div className="relative mb-6 h-56 overflow-hidden rounded-2xl bg-slate-100">
                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute left-4 top-4">
                  <Badge className="bg-white text-orange-600 shadow-sm hover:bg-white">{product.category}</Badge>
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tight">{product.name}</h1>
              <p className="mt-2 text-slate-600">ID do Produto: {product.id}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={`border-emerald-200 text-emerald-700 ${product.stockStatus !== "Pronto para envio" ? "hidden" : ""}`}>Pronto para envio</Badge>
                <Badge variant="outline" className={`border-amber-200 text-amber-700 ${product.stockStatus !== "Stock limitado" ? "hidden" : ""}`}>Stock limitado</Badge>
                <Badge variant="outline" className={`border-slate-200 text-slate-600 ${product.stockStatus !== "Em produção" ? "hidden" : ""}`}>Em produção</Badge>
                <Badge className="bg-orange-50 text-orange-600 hover:bg-orange-50">{product.customsStatus}</Badge>
                <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">Verificado</Badge>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm text-slate-500">Preço</p>
                  <p className="mt-1 text-xl font-bold text-orange-600">{formatCurrency(product.price)} / {product.unit}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm text-slate-500">MOQ</p>
                  <p className="mt-1 text-xl font-bold">{product.moq.toLocaleString()}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm text-slate-500">Prazo</p>
                  <p className="mt-1 text-xl font-bold">{product.leadTimeDays} dias</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 p-3">
                  <CheckCircle2 className="h-4 w-4 text-orange-600" />
                  <div><p className="text-xs text-slate-500">Fornecedor</p><p className="font-medium">{product.agent}</p></div>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 p-3">
                  <MapPin className="h-4 w-4 text-orange-600" />
                  <div><p className="text-xs text-slate-500">Origem</p><p className="font-medium">{product.origin}</p></div>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 p-3">
                  <Warehouse className="h-4 w-4 text-orange-600" />
                  <div><p className="text-xs text-slate-500">Armazém</p><p className="font-medium">{product.warehouse}</p></div>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 p-3">
                  <Ship className="h-4 w-4 text-orange-600" />
                  <div><p className="text-xs text-slate-500">Frete</p><p className="font-medium">{product.freightMode} · {product.incoterm}</p></div>
                </div>
              </div>
            </div>
            <Card className="border-red-100 bg-white">
              <CardHeader>
                <CardTitle>Comprar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Quantidade</p>
                    <p className="text-xs text-slate-500">Mínimo: {product.moq.toLocaleString()} {product.unit}(s)</p>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-lg font-semibold transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                      onClick={() => setQty(Math.max(product.moq, qty - product.moq))}
                    >−</button>
                    <span className="min-w-[4rem] text-center text-2xl font-bold tabular-nums">{qty.toLocaleString()}</span>
                    <button
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-lg font-semibold transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                      onClick={() => setQty(qty + product.moq)}
                    >+</button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Resumo da Compra</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Produto</span>
                      <span className="max-w-[180px] text-right font-medium">{product.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Agente</span>
                      <span className="font-medium">{product.agent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Preço Unitário</span>
                      <span className="font-medium">{formatCurrency(product.price)} / {product.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Quantidade</span>
                      <span className="font-medium">{qty.toLocaleString()} {product.unit}(s)</span>
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Valor Total</span>
                    <span className="text-xl font-bold text-orange-600">{formatCurrency(product.price * qty)}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400">Preço final Roseair — inclui frete, desalfandegamento e comissão de operação. Sem custos ocultos.</p>

                <Button
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  onClick={() => {
                    addToCart(product.id, qty);
                    navigate("/checkout");
                  }}
                >
                  Comprar Agora
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-slate-300"
                  onClick={() => {
                    addToCart(product.id, qty);
                    navigate("/cart");
                  }}
                >
                  Adicionar ao Carrinho
                </Button>
                <Button variant="ghost" className="w-full text-slate-500 hover:bg-slate-100" onClick={() => setSaved(toggleSaved(product.id))}>
                  {saved ? "Produto Guardado ✓" : "Guardar Produto"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-3">
        <Card className="border-slate-200 bg-white lg:col-span-2">
          <CardHeader>
            <CardTitle>Detalhes Comerciais</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {[
              [MapPin, "Origem", product.origin],
              [Ship, "Destino", product.destination],
              [PackageCheck, "Incoterm", `${product.incoterm} ${product.origin.split(",")[0]}`],
              [CheckCircle2, "Agente", product.agent],
              [ShieldCheck, "Alfândega", product.customsStatus],
              [Warehouse, "Armazém", product.warehouse],
            ].map(([Icon, label, value]) => {
              const DetailIcon = Icon as typeof MapPin;

              return (
                <div key={String(label)} className="flex gap-3 rounded-2xl border border-slate-200 p-4">
                  <DetailIcon className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-slate-500">{String(label)}</p>
                    <p className="font-semibold">{String(value)}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle>Prontidão de Importação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {[
              ["Verificação do fornecedor", 100],
              ["Documentos de exportação", 86],
              ["Preparação aduaneira", 72],
              ["Reserva de armazém", 64],
            ].map(([label, value]) => (
              <div key={String(label)}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium">{String(label)}</span>
                  <span className="text-slate-500">{Number(value)}%</span>
                </div>
                <Progress value={Number(value)} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-orange-600" /> Cronograma Logístico
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-4">
            {[
              "Compra e pagamento confirmados",
              "Agente prepara o envio",
              "Frete e desalfandegamento",
              `Recepção no armazém de ${product.warehouse}`,
            ].map((step, index) => (
              <div key={step} className="rounded-2xl border border-slate-200 p-4">
                <Badge className="bg-orange-50 text-orange-600 hover:bg-orange-50">Passo {index + 1}</Badge>
                <p className="mt-3 font-semibold">{step}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-bold">
          <Boxes className="h-5 w-5 text-orange-600" /> Outros Agentes Nesta Categoria
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products
            .filter((p) => p.category === product.category && p.agent !== product.agent)
            .slice(0, 4)
            .map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        {products.filter((p) => p.category === product.category && p.agent !== product.agent).length === 0 && (
          <p className="py-6 text-center text-sm text-slate-500">Nenhum outro agente encontrado nesta categoria.</p>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-bold">
          <Boxes className="h-5 w-5 text-orange-600" /> Também Pode Interessar
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products
            .filter((p) => p.category !== product.category && p.id !== product.id)
            .slice(0, 4)
            .map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </main>
  );
}
