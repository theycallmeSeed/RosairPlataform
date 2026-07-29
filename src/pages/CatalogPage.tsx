import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowUpDown, PackageCheck, ShieldCheck, Ship, SlidersHorizontal } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { products } from "@/data/products";

const freightModes = ["Marítimo", "Aéreo", "Marítimo + Rodoviário"] as const;
const customsStatuses = ["Pré-desembaraçado", "Documentação pronta", "Revisão pautal necessária"] as const;

/**
 * The full, filterable catalog — reached from header search, category clicks,
 * or "Ver Tudo". The homepage (MarketplacePage) is the discovery surface;
 * this page is the "shop everything" surface, both share the ProductCard.
 */
export default function CatalogPage() {
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get("search") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "All");
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [selectedCustoms, setSelectedCustoms] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("recommended");

  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map((p) => p.category)))], []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products
      .filter((product) => {
        const matchesSearch =
          normalizedSearch.length === 0 ||
          [product.name, product.category, product.origin, product.destination, product.agent, product.incoterm]
            .join(" ")
            .toLowerCase()
            .includes(normalizedSearch);
        const matchesCategory = category === "All" || product.category === category;
        const matchesMode = selectedModes.length === 0 || selectedModes.includes(product.freightMode);
        const matchesCustoms = selectedCustoms.length === 0 || selectedCustoms.includes(product.customsStatus);

        return matchesSearch && matchesCategory && matchesMode && matchesCustoms;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "lead-time") return a.leadTimeDays - b.leadTimeDays;
        if (sortBy === "rating") return b.rating - a.rating;

        return Number(b.verified) - Number(a.verified) || b.rating - a.rating;
      });
  }, [category, search, selectedCustoms, selectedModes, sortBy]);

  const toggleValue = (value: string, values: string[], setValues: (next: string[]) => void) => {
    setValues(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };

  return (
    <main className="min-h-screen bg-orange-50/30 text-slate-950">
      <SiteHeader />

      <section className="border-b border-orange-100 bg-gradient-to-r from-orange-600 to-red-600 py-10 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <Badge className="bg-white/20 text-white hover:bg-white/20">Catálogo Linkano</Badge>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
            {category === "All" ? "Todos os Produtos" : category}
          </h1>
          <p className="mt-3 max-w-2xl text-white/90">
            {filteredProducts.length} produtos prontos para importar, com preço final, envio incluído e supervisão Roseair.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-5">
          <Card className="border-orange-100 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <SlidersHorizontal className="h-5 w-5 text-orange-600" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="mb-3 text-sm font-semibold text-slate-900">Categoria</div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue placeholder="Categoria" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c === "All" ? "Todas" : c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Ship className="h-4 w-4 text-orange-600" /> Modo de frete
                </div>
                <div className="space-y-3">
                  {freightModes.map((mode) => (
                    <label key={mode} className="flex cursor-pointer items-center gap-3 text-sm text-slate-600">
                      <Checkbox checked={selectedModes.includes(mode)} onCheckedChange={() => toggleValue(mode, selectedModes, setSelectedModes)} />
                      {mode}
                    </label>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <ShieldCheck className="h-4 w-4 text-orange-600" /> Prontidão aduaneira
                </div>
                <div className="space-y-3">
                  {customsStatuses.map((status) => (
                    <label key={status} className="flex cursor-pointer items-center gap-3 text-sm text-slate-600">
                      <Checkbox checked={selectedCustoms.includes(status)} onCheckedChange={() => toggleValue(status, selectedCustoms, setSelectedCustoms)} />
                      {status}
                    </label>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-slate-300"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                  setSelectedModes([]);
                  setSelectedCustoms([]);
                  setSortBy("recommended");
                }}
              >
                Limpar filtros
              </Button>
            </CardContent>
          </Card>
        </aside>

        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <p className="text-sm font-medium text-slate-500">A mostrar {filteredProducts.length} de {products.length} produtos</p>
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-52">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recomendado</SelectItem>
                  <SelectItem value="price-low">Menor preço</SelectItem>
                  <SelectItem value="lead-time">Prazo mais curto</SelectItem>
                  <SelectItem value="rating">Melhor classificado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <Card className="border-dashed border-slate-300 bg-white">
              <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <PackageCheck className="h-12 w-12 text-orange-600" />
                <h3 className="mt-4 text-xl font-semibold">Nenhum produto correspondente</h3>
                <p className="mt-2 max-w-md text-sm text-slate-500">Ajuste a sua pesquisa, categoria ou filtros para ver mais ofertas prontas para importar.</p>
                <Button className="mt-6 bg-gradient-to-r from-orange-600 to-red-600" onClick={() => setSearch("")}>Limpar pesquisa</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </main>
  );
}
