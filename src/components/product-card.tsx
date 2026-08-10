import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Truck, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/cart";
import type { Product } from "@/data/products";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 10 ? 2 : 0,
  }).format(value);

type ProductCardProps = {
  product: Product;
  /** Compact = fixed-width card for horizontal scroll rows (Flash Deals, Best Sellers, ...). */
  compact?: boolean;
};

/**
 * The canonical product card used across the homepage, catalog and related-
 * products rails. Every card carries the full trust/commercial signal set
 * required by the marketplace redesign: discount ribbon, Linkano Approved,
 * Verified Agent, shipping-included tag, and a Buy Now action.
 */
export function ProductCard({ product, compact = false }: ProductCardProps) {
  const navigate = useNavigate();
  const hasDiscount = !!product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const handleBuyNow = () => {
    addToCart(product.id, product.moq);
    navigate("/checkout");
  };

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl ${
        compact ? "w-52 shrink-0 snap-start sm:w-60" : ""
      }`}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {hasDiscount && (
            <span className="absolute left-0 top-3 rounded-r-full bg-gold-500 py-1 pl-3 pr-4 text-xs font-extrabold text-slate-950 shadow-md">
              -{discountPercent}%
            </span>
          )}

          <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-brand-600 shadow-sm" title="Aprovado Linkano">
            <ShieldCheck className="h-4 w-4" />
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <Link to={`/product/${product.id}`} className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-slate-950 transition hover:text-brand-600">
          {product.name}
        </Link>

        <div className="flex flex-wrap items-center gap-1 text-[10px] font-medium text-slate-500">
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-brand-700">
            <ShieldCheck className="h-2.5 w-2.5" /> Aprovado Linkano
          </span>
          {product.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">
              <Zap className="h-2.5 w-2.5" /> Agente Verificado
            </span>
          )}
        </div>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-brand-600">{formatCurrency(product.price)}</span>
          {hasDiscount && <span className="text-xs font-medium text-slate-400 line-through">{formatCurrency(product.originalPrice!)}</span>}
          <span className="text-[10px] text-slate-400">/{product.unit}</span>
        </div>

        <p className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
          <Truck className="h-3 w-3" /> Envio incluído no preço
        </p>

        <Button
          className="mt-2 h-9 w-full bg-brand-600 text-xs font-bold shadow-sm hover:bg-brand-700"
          onClick={handleBuyNow}
        >
          Comprar Agora
        </Button>
      </div>
    </div>
  );
}
