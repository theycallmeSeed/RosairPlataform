import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShieldCheck, ShoppingCart, Sparkles, Store, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { products } from "@/data/products";
import { getCartCount } from "@/lib/cart";

type SiteHeaderProps = {
  /** Extra actions rendered at the right edge, before the standard nav buttons (e.g. Admin/Agent shortcuts). */
  extraActions?: ReactNode;
};

const TICKER_ITEMS = [
  "🚀 Envio incluído em todos os produtos",
  "💳 Pague com M-Pesa, e-Mola ou Transferência Bancária",
  "🛡️ Todos os produtos aprovados pela Roseair antes de publicados",
  "🌍 Importação directa da China para Moçambique e SADC",
];

/**
 * Shared header for every Buyer/Agent-facing page: promo ticker, always-on
 * search, and a sticky category rail — the "categories always visible" +
 * "sticky search/navigation" requirements of the marketplace redesign.
 */
export function SiteHeader({ extraActions }: SiteHeaderProps) {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const sync = () => setCartCount(getCartCount());
    sync();
    window.addEventListener("roseair_cart_updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("roseair_cart_updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const categories = useMemo(() => {
    const counts = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([name]) => name);
  }, []);

  const handleSearch = () => {
    navigate(query.trim() ? `/marketplace?search=${encodeURIComponent(query.trim())}` : "/marketplace");
  };

  return (
    <div className="sticky top-0 z-50">
      <div className="overflow-hidden bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 py-1.5 text-white">
        <div className="flex animate-marquee whitespace-nowrap text-xs font-semibold">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="mx-6 inline-flex items-center gap-1.5">
              {item}
            </span>
          ))}
        </div>
      </div>

      <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-lg font-black text-white shadow-md">
              L
            </div>
            <div className="hidden sm:block">
              <p className="text-2xl font-extrabold leading-none tracking-tight text-slate-950">Linkano</p>
              <p className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-orange-600">
                <ShieldCheck className="h-3 w-3" /> Powered by Roseair
              </p>
            </div>
          </Link>

          <div className="flex flex-1 items-center gap-2 rounded-full border-2 border-orange-500/80 bg-white pl-4 pr-1.5 py-1 shadow-sm transition focus-within:border-orange-600 focus-within:ring-2 focus-within:ring-orange-200">
            <Search className="h-5 w-5 shrink-0 text-orange-500" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
              placeholder="Pesquisar milhares de produtos, marcas, categorias..."
            />
            <Button onClick={handleSearch} className="hidden h-8 shrink-0 rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-5 text-xs font-bold hover:from-orange-700 hover:to-red-700 sm:inline-flex">
              Pesquisar
            </Button>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {extraActions}
            <Button asChild variant="ghost" className="hidden text-slate-600 hover:text-orange-700 lg:inline-flex">
              <Link to="/buyer"><User className="mr-2 h-4 w-4" /> A Minha Conta</Link>
            </Button>
            <Button asChild variant="ghost" className="hidden text-slate-600 hover:text-orange-700 lg:inline-flex">
              <Link to="/agent"><Store className="mr-2 h-4 w-4" /> Vender no Linkano</Link>
            </Button>
            <Button asChild variant="outline" className="relative border-slate-300">
              <Link to="/cart">
                <ShoppingCart className="h-4 w-4" />
                <span className="ml-2 hidden lg:inline">Carrinho</span>
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>
          </div>
        </div>

        <nav className="scrollbar-none border-t border-orange-100 bg-orange-50/60 px-4 py-2 sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto">
            <Link
              to="/marketplace"
              className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm"
            >
              <Sparkles className="h-3 w-3" /> Ver Tudo
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/marketplace?category=${encodeURIComponent(cat)}`}
                className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-white hover:text-orange-700 hover:shadow-sm"
              >
                {cat}
              </Link>
            ))}
          </div>
        </nav>
      </header>
    </div>
  );
}
