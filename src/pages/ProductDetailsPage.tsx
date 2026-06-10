import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ClipboardCheck, MapPin, PackageCheck, ShieldCheck, Ship, Store, Warehouse } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { products } from "@/data/products";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 10 ? 2 : 0,
  }).format(value);



export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-950">
        <section className="mx-auto max-w-7xl px-6 py-20 text-center">
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Produto não encontrado</Badge>
          <h1 className="mt-6 text-4xl font-bold tracking-tight">Produto não disponível</h1>
          <p className="mt-4 text-slate-600">O produto que procura não existe ou foi removido.</p>
          <Button asChild className="mt-8 bg-red-700 hover:bg-red-800">
            <Link to="/marketplace">Voltar ao Marketplace</Link>
          </Button>
        </section>
      </main>
    );
  }

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
            <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">Moçambique + SADC</Badge>
            <Button asChild variant="outline" className="border-slate-300">
              <Link to="/agent">Painel do Agente</Link>
            </Button>
            <Button asChild className="bg-red-700 hover:bg-red-800">
              <Link to="/marketplace">Explorar Marketplace</Link>
            </Button>
          </div>
        </div>
      </header>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Button asChild variant="ghost" className="mb-6 text-red-700 hover:bg-red-50 hover:text-red-800">
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
                  <Badge className="bg-white text-red-700 shadow-sm hover:bg-white">{product.category}</Badge>
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tight">{product.name}</h1>
              <p className="mt-2 text-slate-600">ID do Produto: {product.id}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm text-slate-500">Preço</p>
                  <p className="mt-1 text-xl font-bold text-red-700">{formatCurrency(product.price)} / {product.unit}</p>
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
            </div>
            <Card className="border-red-100 bg-white">
              <CardHeader>
                <CardTitle>Solicitar Cotação de Importação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-red-700 hover:bg-red-800" onClick={() => navigate(`/quote/success?product=${product.id}`)}>
                  Solicitar Cotação
                </Button>
                <Button variant="outline" className="w-full border-slate-300" onClick={() => setSaved(true)} disabled={saved}>
                  {saved ? "Produto Guardado ✓" : "Guardar Produto"}
                </Button>
                <p className="text-sm leading-6 text-slate-500">A Roseair validará os termos do fornecedor, rota de frete, documentos aduaneiros e opções de recepção em armazém.</p>
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
                  <DetailIcon className="h-5 w-5 text-red-700" />
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
              <ClipboardCheck className="h-5 w-5 text-red-700" /> Cronograma Logístico
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-4">
            {[
              "Cotação solicitada",
              "Fornecedor confirmado",
              "Frete agendado",
              `Recepção no armazém de ${product.warehouse}`,
            ].map((step, index) => (
              <div key={step} className="rounded-2xl border border-slate-200 p-4">
                <Badge className="bg-red-50 text-red-700 hover:bg-red-50">Passo {index + 1}</Badge>
                <p className="mt-3 font-semibold">{step}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
