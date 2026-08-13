import { type ReactNode, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Battery,
  Boxes,
  Clock3,
  Flame,
  Hammer,
  Leaf,
  Plane,
  Plug,
  Search,
  Shirt,
  ShieldCheck,
  Sofa,
  Sparkles,
  Stethoscope,
  Timer,
  TrendingUp,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { products, type Product } from "@/data/products";

const categoryIcons: Record<string, typeof Boxes> = {
  Energia: Zap,
  Embalagens: Boxes,
  Armazenagem: Boxes,
  "Peças Automóveis": Wrench,
  "Serviços Alimentares": Flame,
  Electrónica: Plug,
  Construção: Hammer,
  "Material Médico": Stethoscope,
  Agricultura: Leaf,
  Mobiliário: Sofa,
  "Ferramentas e Ferragens": Wrench,
  Têxteis: Shirt,
};

const categoryTheme = [
  "from-brand-600 to-brand-800",
  "from-gold-500 to-gold-700",
  "from-brand-500 to-brand-700",
  "from-gold-600 to-brand-700",
  "from-brand-700 to-brand-900",
  "from-gold-500 to-brand-600",
];

/**
 * A horizontal, snap-scrolling rail of product cards used for Flash Deals,
 * Best Sellers and China Direct Imports — the "multiple horizontal product
 * sections" requirement.
 */
function ProductRail({ items }: { items: Product[] }) {
  return (
    <div className="flex snap-x gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} compact />
      ))}
    </div>
  );
}

function SectionHeader({ eyebrow, title, icon, action }: { eyebrow: string; title: string; icon: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600">
          {icon} {eyebrow}
        </span>
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

/**
 * Homepage IS the Marketplace (business.md §6). This page is the discovery
 * surface only — sections, banners, rails. Search/browsing with real filters
 * lives on CatalogPage (/marketplace).
 */
export default function MarketplacePage() {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState("");

  const categoryCounts = useMemo(() => {
    return products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, []);

  const categories = useMemo(
    () => Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).map(([name]) => name),
    [categoryCounts],
  );

  const flashDeals = useMemo(() => products.filter((p) => p.originalPrice && p.originalPrice > p.price), []);
  const bestSellers = useMemo(() => [...products].sort((a, b) => b.rating - a.rating).slice(0, 10), []);
  const newArrivals = useMemo(() => [...products].slice(-10).reverse(), []);
  const recommended = useMemo(() => products.filter((p) => p.verified).slice(4, 14), []);
  const chinaDirect = useMemo(() => [...products].sort((a, b) => a.leadTimeDays - b.leadTimeDays).slice(0, 10), []);
  const recentlyAdded = useMemo(() => [...products].slice(-8).reverse(), []);
  const popularCategories = useMemo(() => categories.slice(0, 6), [categories]);

  const handleHeroSearch = () => {
    navigate(heroSearch.trim() ? `/marketplace?search=${encodeURIComponent(heroSearch.trim())}` : "/marketplace");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50/50 via-white to-white text-slate-950">
      <SiteHeader />

      {/* 1. Hero Search */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-gold-500 py-14 text-white sm:py-20">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-gold-300/20 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <Badge className="bg-white/20 text-white hover:bg-white/20">🇲🇿 O maior marketplace de importação de Moçambique</Badge>
          <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-6xl">
            Compre o mundo.<br /> Entregue em Moçambique.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90 sm:text-xl">
            Milhares de produtos da China com preço final, envio incluído e cada compra supervisionada pela Linkano — do pagamento à entrega.
          </p>

          <div className="mx-auto mt-8 flex max-w-2xl items-center gap-2 rounded-full bg-white p-2 shadow-2xl">
            <Search className="ml-3 h-6 w-6 shrink-0 text-brand-500" />
            <Input
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleHeroSearch()}
              className="h-12 border-0 bg-transparent text-base text-slate-900 shadow-none focus-visible:ring-0"
              placeholder="Painéis solares, smartphones, peças auto..."
            />
            <Button onClick={handleHeroSearch} className="h-12 shrink-0 rounded-full bg-brand-600 px-6 text-sm font-bold hover:bg-brand-700">
              Pesquisar
            </Button>
          </div>

          <div className="mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm font-semibold text-white/90">
            <span className="flex items-center gap-1.5"><Boxes className="h-4 w-4" /> {products.length}+ produtos</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> {new Set(products.map((p) => p.agent)).size} agentes aprovados</span>
            <span className="flex items-center gap-1.5"><Truck className="h-4 w-4" /> Envio sempre incluído</span>
          </div>
        </div>
      </section>

      {/* 2. Categories (quick nav) */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat] ?? Boxes;
            return (
              <Link
                key={cat}
                to={`/marketplace?category=${encodeURIComponent(cat)}`}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-brand-100 bg-white p-3 text-center transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-gold-50 text-brand-600 transition group-hover:from-brand-600 group-hover:to-brand-800 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="line-clamp-2 text-[11px] font-semibold leading-tight text-slate-700">{cat}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Main Promotional Banner */}
      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="grid gap-4 lg:grid-cols-3">
          <Link
            to="/marketplace?category=Energia"
            className="group relative col-span-2 flex min-h-[220px] flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-gold-600 p-8 text-white shadow-xl"
          >
            <Sparkles className="pointer-events-none absolute right-8 top-8 h-24 w-24 text-white/15 transition group-hover:scale-110" />
            <Badge className="w-fit bg-white/20 text-white hover:bg-white/20">Campanha da Semana</Badge>
            <h3 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">Energia Solar até -30%</h3>
            <p className="mt-2 max-w-md text-white/90">Painéis, inversores e baterias prontos para envio, com preço final e supervisão Linkano.</p>
            <span className="mt-4 inline-flex w-fit items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-bold text-brand-700">Ver Ofertas →</span>
          </Link>

          <div className="grid grid-rows-2 gap-4">
            <Link to="/marketplace?category=Electrónica" className="group relative flex flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-br from-gold-500 to-gold-700 p-6 text-white shadow-lg">
              <Badge className="w-fit bg-white/20 text-white hover:bg-white/20">Novidade</Badge>
              <h4 className="mt-2 text-xl font-extrabold">Electrónica Directa da China</h4>
              <span className="mt-2 text-xs font-bold text-white/90">Explorar →</span>
            </Link>
            <Link to="/marketplace?category=Construção" className="group relative flex flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white shadow-lg">
              <Badge className="w-fit bg-white/20 text-white hover:bg-white/20">Grandes Volumes</Badge>
              <h4 className="mt-2 text-xl font-extrabold">Materiais de Construção</h4>
              <span className="mt-2 text-xs font-bold text-white/90">Explorar →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Flash Deals */}
      <section className="border-y border-gold-100 bg-gradient-to-r from-gold-50 via-white to-brand-50/40 py-10">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader
            eyebrow="Por tempo limitado"
            title="Ofertas Relâmpago"
            icon={<Timer className="h-4 w-4" />}
            action={
              <span className="flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow-sm">
                <Clock3 className="h-3.5 w-3.5" /> Termina em breve
              </span>
            }
          />
          <ProductRail items={flashDeals} />
        </div>
      </section>

      {/* 5. Best Sellers */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <SectionHeader eyebrow="Os favoritos dos compradores" title="Mais Vendidos" icon={<TrendingUp className="h-4 w-4" />} />
        <ProductRail items={bestSellers} />
      </section>

      {/* 6. New Arrivals */}
      <section className="bg-slate-50 py-10">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader eyebrow="Acabaram de chegar" title="Novidades" icon={<Sparkles className="h-4 w-4" />} />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {newArrivals.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      {/* 7. Popular Categories */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <SectionHeader eyebrow="Onde toda a gente está a comprar" title="Categorias Populares" icon={<Boxes className="h-4 w-4" />} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popularCategories.map((cat, i) => {
            const sample = products.find((p) => p.category === cat);
            return (
              <Link
                key={cat}
                to={`/marketplace?category=${encodeURIComponent(cat)}`}
                className={`group relative flex h-40 items-end overflow-hidden rounded-3xl bg-gradient-to-br ${categoryTheme[i % categoryTheme.length]} p-5 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl`}
              >
                {sample && (
                  <img src={sample.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30 transition group-hover:opacity-40" />
                )}
                <div className="relative">
                  <p className="text-xl font-black">{cat}</p>
                  <p className="text-xs font-semibold text-white/90">{categoryCounts[cat]} produtos</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 8. Recommended Products */}
      <section className="bg-slate-50 py-10">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader eyebrow="Escolhidos para si" title="Recomendados" icon={<Sparkles className="h-4 w-4" />} />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {recommended.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      {/* 9. China Direct Imports */}
      <section className="border-y border-brand-100 bg-gradient-to-r from-brand-700 via-brand-600 to-brand-800 py-10 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader
            eyebrow="Sem intermediários"
            title="Importação Directa da China"
            icon={<Plane className="h-4 w-4" />}
            action={<span className="text-xs font-semibold text-white/80">Fornecedores verificados · Preço final · Envio incluído</span>}
          />
          <ProductRail items={chinaDirect} />
        </div>
      </section>

      {/* 10. Recently Added */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <SectionHeader eyebrow="Frescos no catálogo" title="Adicionados Recentemente" icon={<Battery className="h-4 w-4" />} />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {recentlyAdded.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
        <div className="mt-8 flex justify-center">
          <Button asChild className="h-12 rounded-full bg-brand-600 px-8 text-sm font-bold hover:bg-brand-700">
            <Link to="/marketplace">Ver Catálogo Completo</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-brand-600" />
            Linkano — Compras sem Fronteira. Pagamento, logística, armazenagem e desembaraço garantidos.
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <Link className="transition hover:text-brand-600" to="/buyer">A Minha Conta</Link>
            <Link className="transition hover:text-brand-600" to="/agent">Vender no Linkano</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
