import { useSearchParams, Link } from "react-router-dom";
import { Boxes, CheckCircle2, Clock3, MapPin, PackageCheck, Ship, Store } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { products } from "@/data/products";

function estimateValue(id: string, qty: number): string {
  const p = products.find((x) => x.id === id);
  if (!p) return "USD --";
  return (p.price * qty).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function daysForProduct(id: string): string {
  const p = products.find((x) => x.id === id);
  return p ? `${p.leadTimeDays} dias` : "--";
}

export default function QuoteRequestSuccessPage() {
  const [params] = useSearchParams();
  const productId = params.get("product") ?? "PRD-001";
  const rawQty = Number(params.get("qty")) || 1;
  const product = products.find((p) => p.id === productId);

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
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <Link className="transition hover:text-red-700" to="/buyer">Central do Comprador</Link>
            <Link className="transition hover:text-red-700" to="/agent">Tornar-se Agente</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
        <Badge className="mt-6 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Cotação Solicitada com Sucesso</Badge>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">A sua solicitação foi recebida</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
          A Roseair irá analisar a sua solicitação e o agente responderá com uma cotação formal em até <strong>48 horas</strong>.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-12">
        <Card className="border-emerald-100 bg-white shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center gap-2">
              <PackageCheck className="h-5 w-5 text-red-700" /> Detalhes da Cotação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Produto</p>
                <p className="mt-1 font-semibold">{product?.name ?? productId}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Fornecedor</p>
                <p className="mt-1 font-semibold">{product?.agent ?? "--"}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="flex items-center gap-2 text-sm text-slate-500"><MapPin className="h-4 w-4 text-red-700" /> Origem</p>
                <p className="mt-1 font-semibold">{product?.origin ?? "--"}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="flex items-center gap-2 text-sm text-slate-500"><Ship className="h-4 w-4 text-red-700" /> Destino</p>
                <p className="mt-1 font-semibold">{product?.destination ?? "--"}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Quantidade solicitada</p>
                <p className="mt-1 font-bold">{rawQty.toLocaleString()} {product?.unit ?? "unidade(s)"}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="flex items-center gap-2 text-sm text-slate-500"><Clock3 className="h-4 w-4 text-red-700" /> Prazo estimado</p>
                <p className="mt-1 font-semibold">{product ? `${product.leadTimeDays} dias` : "--"}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-red-50 p-4">
              <p className="text-sm text-slate-500">Valor total estimado</p>
              <p className="mt-1 text-2xl font-bold text-red-700">{estimateValue(productId, rawQty)}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="font-semibold">Próximos Passos</p>
              <ol className="mt-4 space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700">1</span>
                  O agente recebe a sua solicitação e prepara uma cotação formal
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700">2</span>
                  A Roseair valida os termos comerciais, rota de frete e documentos aduaneiros
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700">3</span>
                  Recebe a cotação final com opções de logística, alfândega e armazenagem
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700">4</span>
                  Confirma a encomenda e a Roseair executa a operação de ponta a ponta
                </li>
              </ol>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="flex-1 bg-red-700 hover:bg-red-800">
                <Link to="/marketplace">Continuar a Explorar Produtos</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 border-slate-300">
                <Link to="/buyer">Minhas Cotações</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 border-slate-300">
                <Link to="/">Voltar ao Início</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-12">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-bold">
          <Boxes className="h-5 w-5 text-red-700" /> Também Pode Interessar
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products
            .filter((p) => p.id !== productId)
            .slice(0, 4)
            .map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-lg">
                <div className="relative h-28 overflow-hidden bg-slate-100">
                  <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 text-xs font-semibold leading-snug">{p.name}</p>
                  <p className="mt-0.5 text-[10px] text-slate-500">{p.agent}</p>
                  <p className="mt-1 text-xs font-bold text-red-700">
                    {(p.price * rawQty).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </main>
  );
}
