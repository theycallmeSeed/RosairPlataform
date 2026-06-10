import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  Boxes,
  CheckCircle2,
  Clock3,
  Filter,
  MapPin,
  PackageCheck,
  Search,
  ShieldCheck,
  Ship,
  SlidersHorizontal,
  Store,
  Warehouse,
} from "lucide-react";

import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { products } from "@/data/products";

const categories = ["All", "Energia", "Embalagens", "Armazenagem", "Peças Automóveis", "Serviços Alimentares", "Electrónica", "Construção", "Material Médico", "Agricultura", "Mobiliário", "Ferramentas e Ferragens", "Têxteis"];
const categoryLabels: Record<string, string> = { All: "Todas" };
const freightModes = ["Marítimo", "Aéreo", "Marítimo + Rodoviário"] as const;
const customsStatuses = ["Pré-desembaraçado", "Documentação pronta", "Revisão pautal necessária"] as const;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 10 ? 2 : 0,
  }).format(value);

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [selectedCustoms, setSelectedCustoms] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("recommended");

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
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Roseair Marketplace</Badge>
              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">Produtos prontos para importar da China</h1>
              <p className="mt-3 max-w-2xl text-slate-600">
                Pesquise anúncios de agentes verificados com rotas logísticas, prontidão aduaneira e disponibilidade de armazém para Moçambique e região SADC.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-center">
              <div>
                <p className="text-2xl font-bold text-red-700">{products.length}</p>
                <p className="text-xs font-medium text-slate-500">Produtos</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-700">4</p>
                <p className="text-xs font-medium text-slate-500">Rotas comerciais</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-700">3</p>
                <p className="text-xs font-medium text-slate-500">Armazéns</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:flex-row lg:items-center">
            <div className="flex flex-1 items-center gap-2 rounded-xl bg-slate-50 px-3">
              <Search className="h-5 w-5 text-slate-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                placeholder="Pesquisar produtos, fornecedores, origem, palavras-chave HS..."
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full lg:w-56">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((item) => (
                  <SelectItem key={item} value={item}>{categoryLabels[item] ?? item}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-52">
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
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-5">
          <Card className="border-slate-200 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <SlidersHorizontal className="h-5 w-5 text-red-700" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Ship className="h-4 w-4 text-red-700" /> Modo de frete
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
                  <ShieldCheck className="h-4 w-4 text-red-700" /> Prontidão aduaneira
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

              <Separator />

              <div className="rounded-2xl bg-red-50 p-4">
                <div className="flex items-center gap-2 font-semibold text-red-800">
                  <Filter className="h-4 w-4" /> Apoio à importação
                </div>
                <p className="mt-2 text-sm leading-6 text-red-900/70">Todos os anúncios incluem coordenação logística Roseair, revisão de documentos aduaneiros e opções de roteamento de armazém.</p>
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

          <Card className="border-slate-200 bg-white">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <Warehouse className="h-5 w-5 text-red-700" />
                <p className="font-semibold">Disponibilidade de armazém</p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Maputo Hub</span><span className="font-semibold">68%</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Matola Yard</span><span className="font-semibold">54%</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Beira Cross-Dock</span><span className="font-semibold">72%</span></div>
              </div>
            </CardContent>
          </Card>
        </aside>

        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium text-slate-500">A mostrar {filteredProducts.length} de {products.length} produtos</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight">Ofertas verificadas do marketplace</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {category !== "All" && <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{category}</Badge>}
              {selectedModes.map((mode) => <Badge key={mode} variant="outline">{mode}</Badge>)}
              {selectedCustoms.map((status) => <Badge key={status} variant="outline">{status}</Badge>)}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden border-slate-200 bg-white transition hover:-translate-y-1 hover:border-red-200 hover:shadow-xl">
                <div className="relative h-36 overflow-hidden bg-slate-100">
                  <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute left-4 top-4 flex gap-2">
                    <Badge className="bg-white text-red-700 shadow-sm hover:bg-white">{product.category}</Badge>
                    {product.verified && <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Verificado</Badge>}
                  </div>
                  <div className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-red-700 shadow-sm">
                    <Boxes className="h-6 w-6" />
                  </div>
                </div>

                <CardContent className="p-5">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="line-clamp-2 text-lg font-semibold text-slate-950">{product.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">{product.agent}</p>
                    </div>
                    <Badge variant="outline">{product.rating.toFixed(1)}</Badge>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-red-700" /> {product.origin}</div>
                    <div className="flex items-center gap-2"><Ship className="h-4 w-4 text-red-700" /> {product.destination}</div>
                    <div className="flex items-center gap-2"><Warehouse className="h-4 w-4 text-red-700" /> {product.warehouse}</div>
                  </div>

                  <Separator className="my-5" />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Preço</p>
                      <p className="font-bold text-slate-950">{formatCurrency(product.price)} / {product.unit}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">MOQ</p>
                      <p className="font-bold text-slate-950">{product.moq.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Prazo</p>
                      <p className="flex items-center gap-1 font-bold text-slate-950"><Clock3 className="h-4 w-4 text-red-700" /> {product.leadTimeDays} dias</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Incoterm</p>
                      <p className="font-bold text-slate-950">{product.incoterm}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Badge variant="outline">{product.freightMode}</Badge>
                    <Badge variant="outline">{product.stockStatus}</Badge>
                    <Badge className="bg-red-50 text-red-700 hover:bg-red-50">{product.customsStatus}</Badge>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Button asChild variant="outline" className="border-slate-300">
                      <Link to={`/product/${product.id}`}>Detalhes</Link>
                    </Button>
                    <Button asChild className="bg-red-700 hover:bg-red-800">
                      <Link to={`/product/${product.id}`}>
                        Solicitar Cotação <CheckCircle2 className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <Card className="border-dashed border-slate-300 bg-white">
              <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <PackageCheck className="h-12 w-12 text-red-700" />
                <h3 className="mt-4 text-xl font-semibold">Nenhum produto correspondente</h3>
                <p className="mt-2 max-w-md text-sm text-slate-500">Ajuste a sua pesquisa, categoria, modo de frete ou filtros de prontidão aduaneira para ver mais ofertas prontas para importar.</p>
                <Button className="mt-6 bg-red-700 hover:bg-red-800" onClick={() => setSearch("")}>Limpar pesquisa</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </main>
  );
}
