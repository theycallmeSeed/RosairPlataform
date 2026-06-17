import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Boxes, MapPin, Search, ShieldCheck, ShoppingCart, Store } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { products } from "@/data/products";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 10 ? 2 : 0,
  }).format(value);

const ROSEAR_LABEL = "Operação suportada por Roseair";

export default function LandingPage() {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState("");

  const categoryCounts = useMemo(() => {
    return products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, []);

  const categories = useMemo(() => Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]), [categoryCounts]);

  const handleSearch = () => {
    if (heroSearch.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate("/marketplace");
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-950">
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

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 lg:flex">
            <Link className="transition hover:text-red-700" to="/buyer">Central do Comprador</Link>
            <Link className="transition hover:text-red-700" to="/agent">Tornar-se Agente</Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Button asChild variant="outline" className="border-slate-300">
              <Link to="/buyer">Central do Comprador</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto flex max-w-2xl items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            <Search className="ml-2 h-5 w-5 text-slate-400" />
            <Input
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="border-0 bg-transparent shadow-none focus-visible:ring-0"
              placeholder="O que procura importar hoje? — solar, baterias, peças auto..."
            />
            <Button className="bg-red-700 hover:bg-red-800" onClick={handleSearch}>Pesquisar</Button>
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl gap-6 px-6 py-6">
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24 space-y-1">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Categorias</p>
            {categories.map(([catName, count]) => (
              <Link
                key={catName}
                to={`/marketplace?category=${encodeURIComponent(catName)}`}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition hover:bg-red-50 hover:text-red-700 ${catName === categories[0][0] ? "bg-red-50 font-medium text-red-700" : "text-slate-600"}`}
              >
                <span>{catName}</span>
                <span className="text-xs text-slate-400">{count}</span>
              </Link>
            ))}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-lg">
                <Link to={`/product/${product.id}`} className="block">
                  <div className="relative h-36 overflow-hidden bg-slate-100">
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
                    <Badge className="absolute left-3 top-3 bg-white text-red-700 shadow-sm hover:bg-white text-[10px] px-2 py-0.5">
                      {product.category}
                    </Badge>
                  </div>
                </Link>
                <div className="p-3">
                  <Link to={`/product/${product.id}`} className="line-clamp-2 text-sm font-semibold leading-snug text-slate-950 transition hover:text-red-700">
                    {product.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-slate-500">{product.agent}</p>
                  <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-400"><MapPin className="h-3 w-3" /> {product.origin}</p>

                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm font-bold text-red-700">
                      {formatCurrency(product.price)} <span className="font-normal text-slate-400">/{product.unit}</span>
                    </p>
                    <p className="text-[10px] text-slate-400">MOQ {product.moq.toLocaleString()}</p>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${
                      product.stockStatus === "Pronto para envio" ? "bg-emerald-500"
                      : product.stockStatus === "Stock limitado" ? "bg-amber-500"
                      : "bg-slate-300"
                    }`} />
                    <span className="text-[10px] text-slate-500">{product.stockStatus}</span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Button asChild className="h-8 text-xs bg-red-700 hover:bg-red-800">
                      <Link to={`/product/${product.id}`}>Solicitar Cotação</Link>
                    </Button>
                    <Button asChild variant="outline" className="h-8 text-xs border-slate-300">
                      <Link to={`/product/${product.id}`}>Ver Detalhes</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Oportunidades de Importação</Badge>
          <h2 className="mt-4 text-2xl font-bold tracking-tight">Cotações activas de compradores</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "500 kits inversores solares",
                buyer: "Comprador Maputo",
                value: "USD 92K",
                tags: ["Energia", "FOB Shenzhen"],
              },
              {
                title: "Embalagens de marca própria",
                buyer: "Comprador Beira",
                value: "USD 38K",
                tags: ["Embalagem", "CIF Beira"],
              },
              {
                title: "Sistemas de estantes industriais",
                buyer: "Comprador Matola",
                value: "USD 64K",
                tags: ["Industrial", "Marítimo"],
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-red-200 hover:shadow-md">
                <p className="font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-slate-500">{item.buyer}</p>
                <p className="mt-3 text-lg font-bold text-red-700">{item.value}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-red-700" />
            {ROSEAR_LABEL} — logística, armazenagem e desembaraço garantidos.
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <Link className="transition hover:text-red-700" to="/buyer">Central do Comprador</Link>
            <Link className="transition hover:text-red-700" to="/agent">Tornar-se Agente</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
