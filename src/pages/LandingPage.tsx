import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Building2,
  CheckCircle2,
  Factory,
  Globe2,
  MapPin,
  PackageCheck,
  Search,
  ShieldCheck,
  Ship,
  ShoppingCart,
  Store,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const marketplaceCategories = [
  { name: "Eletrónicos", products: "148 produtos", buyers: "42 compradores ativos", growth: "+21% procura", icon: Boxes },
  { name: "Fornecimento Industrial", products: "96 produtos", buyers: "31 compradores ativos", growth: "+18% procura", icon: Factory },
  { name: "Embalagem", products: "74 produtos", buyers: "27 compradores ativos", growth: "+34% procura", icon: PackageCheck },
  { name: "Peças Auto", products: "82 produtos", buyers: "38 compradores ativos", growth: "+16% procura", icon: Truck },
  { name: "Energia", products: "61 produtos", buyers: "24 compradores ativos", growth: "+29% procura", icon: BarChart3 },
  { name: "Equipamentos Armazenagem", products: "53 produtos", buyers: "19 compradores ativos", growth: "+12% procura", icon: Warehouse },
];

const featuredProducts = [
  {
    id: "PRD-001",
    name: "Commercial Solar Inverter Kits",
    category: "Energia",
    origin: "Shenzhen, China",
    price: "USD 184 / unidade",
    moq: "QTD Mín. 50",
    agent: "Pearl River Export Co.",
    rating: "4.8",
    route: "Shenzhen → Maputo",
    operations: "Documentação aduaneira pronta",
    warehouse: "Centro Logístico de Maputo",
  },
  {
    id: "PRD-002",
    name: "Retail Packaging Cartons",
    category: "Embalagens",
    origin: "Ningbo, China",
    price: "USD 0.42 / peça",
    moq: "QTD Mín. 10.000",
    agent: "Ningbo Trade Desk",
    rating: "4.7",
    route: "Ningbo → Beira",
    operations: "Corredor pré-desembaraçado",
    warehouse: "Plataforma Logística da Beira",
  },
  {
    id: "PRD-003",
    name: "Industrial Shelving Units",
    category: "Armazenagem",
    origin: "Foshan, China",
    price: "USD 68 / conjunto",
    moq: "QTD Mín. 120",
    agent: "Foshan Industrial Supply",
    rating: "4.6",
    route: "Foshan → Matola",
    operations: "Consolidação disponível",
    warehouse: "Parque Logístico da Matola",
  },
];

const steps = [
  { step: "01", title: "Descobrir produtos", text: "Os compradores pesquisam ofertas prontas para importar, categorias, MOQ, preço, classificações de agentes e opções de entrega." },
  { step: "02", title: "Comparar agentes verificados", text: "Agentes na China publicam anúncios com origem, prontidão de exportação, SLA de resposta e estado dos documentos." },
  { step: "03", title: "Solicitar cotação ou RFQ", text: "Os compradores solicitam preços, consolidação, incoterms, modo de frete, apoio aduaneiro e manuseio de armazém." },
  { step: "04", title: "Roseair executa o comércio", text: "A Roseair coordena logística, desalfandegamento e armazenagem enquanto os compradores acompanham a transação de ponta a ponta." },
];

const verifiedAgents = [
  {
    name: "Pearl River Export Co.",
    city: "Shenzhen",
    categories: "Electrónica, energia, iluminação",
    rating: "4.8",
    response: "Resposta média 6h",
    readiness: 94,
  },
  {
    name: "Ningbo Trade Desk",
    city: "Ningbo",
    categories: "Embalagem, bens domésticos, têxteis",
    rating: "4.7",
    response: "Resposta média 9h",
    readiness: 89,
  },
  {
    name: "Foshan Industrial Supply",
    city: "Foshan",
    categories: "Construção, estantes, equipamentos",
    rating: "4.6",
    response: "Resposta média 12h",
    readiness: 83,
  },
];

const importOpportunities = [
  {
    title: "Distribuidor solar de Moçambique precisa de 500 kits inversores",
    buyer: "Comprador Maputo",
    value: "USD 92K est.",
    deadline: "Cotação em 48h",
    tags: ["Energia", "FOB Shenzhen", "Recepção em armazém"],
  },
  {
    title: "Grupo retalhista SADC solicita embalagens de marca própria",
    buyer: "Comprador Beira",
    value: "USD 38K est.",
    deadline: "Cotação em 3 dias",
    tags: ["Embalagem", "CIF Beira", "Consolidação"],
  },
  {
    title: "Operador industrial importa sistemas de estantes armazenagem",
    buyer: "Comprador Matola",
    value: "USD 64K est.",
    deadline: "Cotação esta semana",
    tags: ["Industrial", "Frete marítimo", "Armazenagem necessária"],
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

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
            <a className="transition hover:text-red-700" href="#categories">Categorias</a>
            <a className="transition hover:text-red-700" href="#products">Produtos</a>
            <a className="transition hover:text-red-700" href="#agents">Agentes</a>
            <a className="transition hover:text-red-700" href="#opportunities">Oportunidades</a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
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

      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,#fee2e2,transparent_34%),linear-gradient(135deg,#ffffff_0%,#fff7f7_48%,#ffffff_100%)]">
        <div className="absolute right-0 top-20 hidden h-72 w-72 rounded-full bg-red-100 blur-3xl lg:block" />
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-24">
          <div className="relative z-10">
            <Badge className="mb-6 bg-red-100 text-red-800 hover:bg-red-100">Marketplace B2B para importações da China</Badge>
            <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Importe da China. Compare agentes verificados. Importe com as operações comerciais Roseair.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              O Roseair Marketplace conecta compradores em Moçambique e na região SADC com agentes na China, envolvendo cada transação com logística, desalfandegamento e apoio de armazenagem.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-red-700 hover:bg-red-800">
                <Link to="/marketplace">
                  Explorar Produtos <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-slate-300" onClick={() => navigate("/marketplace")}>Publicar RFQ de Importação</Button>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                ["512", "Anúncios prontos para importar"],
                ["46", "Agentes verificados"],
                ["312", "RFQs ativos"],
                ["9", "Rotas comerciais SADC"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-red-100 bg-white p-4 shadow-sm">
                  <p className="text-2xl font-bold text-red-700">{value}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="relative z-10 border-red-100 bg-white/95 shadow-2xl shadow-red-950/10">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Sala de Negócios Marketplace</CardTitle>
                  <p className="mt-1 text-sm text-slate-500">Procura de compradores, ofertas de agentes e execução Roseair numa só vista.</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Demonstração ao vivo</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
                <Search className="ml-2 h-5 w-5 text-slate-400" />
                <Input className="border-0 bg-transparent shadow-none focus-visible:ring-0" placeholder="Pesquisar solar, embalagem, peças auto..." />
                <Button className="bg-red-700 hover:bg-red-800" onClick={() => navigate("/marketplace")}>Pesquisar</Button>
              </div>

              <div className="rounded-2xl bg-slate-950 p-5 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-300">RFQ em Destaque</p>
                    <p className="mt-2 text-2xl font-semibold">500 kits inversores solares</p>
                    <p className="mt-2 text-sm text-slate-300">Comprador Maputo • Cotação em 48h</p>
                  </div>
                  <ShoppingCart className="h-9 w-9 text-red-300" />
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-slate-400">Alvo</p>
                    <p className="font-semibold">USD 92K</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Agentes</p>
                    <p className="font-semibold">8 correspondências</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Serviço</p>
                    <p className="font-semibold text-red-200">Fim a fim</p>
                  </div>
                </div>
              </div>

              {[
                [Users, "Cotações de agentes", "8 agentes chineses verificados correspondidos"],
                [Ship, "Opções logísticas", "Rotas marítimas, aéreas e terrestres estimadas"],
                [ShieldCheck, "Prontidão aduaneira", "Código HS e lista de documentos preparados"],
                [Warehouse, "Vagas em armazém", "Opções de recepção em Maputo e Matola"],
              ].map(([Icon, title, description]) => {
                const DealIcon = Icon as typeof Users;

                return (
                  <div key={String(title)} className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-700">
                        <DealIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{String(title)}</p>
                        <p className="text-sm text-slate-500">{String(description)}</p>
                      </div>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 md:grid-cols-4">
          {[
            [ShoppingCart, "Compradores", "Pesquisar produtos, solicitar cotações e comparar agentes chineses."],
            [Users, "Agentes na China", "Publicar anúncios, responder a RFQs e gerir documentos de exportação."],
            [Ship, "Logística", "A Roseair conecta encomendas a rotas, ETAs e opções de frete."],
            [ShieldCheck, "Desalfandegamento + armazenagem", "Alfândega e armazenagem integradas nas transações do marketplace."],
          ].map(([Icon, title, description]) => {
            const TrustIcon = Icon as typeof ShoppingCart;

            return (
              <div key={String(title)} className="flex items-start gap-3">
                <div className="rounded-xl bg-red-50 p-2 text-red-700">
                  <TrustIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{String(title)}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{String(description)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Categorias do Marketplace</Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Categorias de fornecimento com visibilidade completa de importação e logística.</h2>
            <p className="mt-4 max-w-2xl text-slate-600">Os compradores descobrem categorias de produtos enquanto veem indicadores operacionais essenciais para importações reais para Moçambique e SADC.</p>
          </div>
            <Button asChild variant="outline" className="border-slate-300">
              <Link to="/marketplace">Explorar Todas as Categorias</Link>
            </Button>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {marketplaceCategories.map((category) => {
            const CategoryIcon = category.icon;

            return (
              <Card key={category.name} className="border-slate-200 transition hover:-translate-y-1 hover:border-red-200 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-700">
                      <CategoryIcon className="h-6 w-6" />
                    </div>
                    <Badge className="bg-red-50 text-red-700 hover:bg-red-50">{category.growth}</Badge>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">{category.name}</h3>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-slate-500">Anúncios</p>
                      <p className="font-semibold">{category.products}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-slate-500">Procura</p>
                      <p className="font-semibold">{category.buyers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="products" className="border-y border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Produtos em Destaque</Badge>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Cartões de produto criados para decisões comerciais, não apenas para navegação.</h2>
              <p className="mt-4 max-w-2xl text-slate-600">Cada produto mostra fornecedor, preço, MOQ, rota, prontidão aduaneira e disponibilidade de armazém para demonstrações.</p>
            </div>
            <Button asChild className="bg-red-700 hover:bg-red-800">
              <Link to="/marketplace">Explorar Marketplace</Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden border-slate-200 bg-white transition hover:-translate-y-1 hover:border-red-200 hover:shadow-xl">
                <div className="relative h-36 bg-gradient-to-br from-red-100 via-white to-slate-100">
                  <Badge className="absolute left-4 top-4 bg-white text-red-700 shadow-sm hover:bg-white">{product.category}</Badge>
                  <div className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-red-700 shadow-sm">
                    <PackageCheck className="h-6 w-6" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-950">{product.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">{product.agent}</p>
                    </div>
                    <Badge variant="outline">{product.rating}</Badge>
                  </div>
                  <p className="flex items-center gap-2 text-sm text-slate-500"><MapPin className="h-4 w-4 text-red-700" /> {product.origin}</p>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-slate-500">Preço</p><p className="font-semibold">{product.price}</p></div>
                    <div><p className="text-slate-500">MOQ</p><p className="font-semibold">{product.moq}</p></div>
                    <div><p className="text-slate-500">Rota</p><p className="font-semibold">{product.route}</p></div>
                    <div><p className="text-slate-500">Armazém</p><p className="font-semibold">{product.warehouse}</p></div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Badge variant="outline">{product.operations}</Badge>
                    <Badge className="bg-red-50 text-red-700 hover:bg-red-50">Suportado pela Roseair</Badge>
                  </div>
                  <Button asChild className="mt-6 w-full bg-red-700 hover:bg-red-800">
                    <Link to={`/product/${product.id}`}>Ver Produto</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <Badge className="bg-red-500/20 text-red-100 hover:bg-red-500/20">Como Funciona</Badge>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Um fluxo de trabalho de marketplace com execução comercial integrada.</h2>
              <p className="mt-4 text-slate-300">A Roseair não só lista produtos. Conecta compradores, agentes, frete, alfândega e armazenagem num único fluxo operacional.</p>
              <Button asChild className="mt-8 bg-red-700 hover:bg-red-800">
                <Link to="/marketplace">Começar a Comprar</Link>
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {steps.map((item) => (
                <div key={item.step} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <p className="text-sm font-bold text-red-300">{item.step}</p>
                  <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="agents" className="border-y border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Agentes Verificados</Badge>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Agentes chineses que os compradores podem comparar antes de decidir.</h2>
              <p className="mt-4 max-w-2xl text-slate-600">Os perfis de agente combinam sinais de confiança do marketplace com prontidão de exportação, velocidade de resposta, especialização em categorias e revisão documental da Roseair.</p>
            </div>
            <Button asChild variant="outline" className="border-slate-300">
              <Link to="/agent">Ver Painel do Agente</Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {verifiedAgents.map((agent) => (
              <Card key={agent.name} className="border-slate-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-700">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Verificado</Badge>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">{agent.name}</h3>
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-500"><MapPin className="h-4 w-4 text-red-700" /> {agent.city}, China</p>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{agent.categories}</p>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-slate-500">Classificação</p>
                      <p className="font-semibold">{agent.rating}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-slate-500">Resposta</p>
                      <p className="font-semibold">{agent.response}</p>
                    </div>
                  </div>
                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-medium text-slate-700">Prontidão de exportação</span>
                      <span className="text-slate-500">{agent.readiness}%</span>
                    </div>
                    <Progress value={agent.readiness} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="opportunities" className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Oportunidades de Importação</Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Transforme a procura dos compradores em cotações de agentes e importações geridas.</h2>
            <p className="mt-4 text-slate-600">O marketplace pode mostrar RFQs ao vivo, sinais de procura e oportunidades de importação de alto valor para que os agentes vejam o que os compradores precisam agora.</p>
            <div className="mt-8 rounded-3xl border border-red-100 bg-red-50 p-6">
              <div className="flex items-center gap-3">
                <Globe2 className="h-6 w-6 text-red-700" />
                <p className="font-semibold text-red-900">Cobertura do mercado-alvo</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-red-900/75">Moçambique primeiro, expandindo pelos corredores de importação da SADC através de fornecimento de agentes, parceiros logísticos, fluxos aduaneiros e nós de armazenagem.</p>
            </div>
          </div>

          <div className="space-y-4">
            {importOpportunities.map((opportunity) => (
              <Card key={opportunity.title} className="border-slate-200 bg-white transition hover:border-red-200 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div>
                      <Badge className="bg-red-50 text-red-700 hover:bg-red-50">{opportunity.deadline}</Badge>
                      <h3 className="mt-4 text-xl font-semibold">{opportunity.title}</h3>
                      <p className="mt-2 text-sm text-slate-500">{opportunity.buyer}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-right">
                      <p className="text-sm text-slate-500">Valor estimado</p>
                      <p className="text-xl font-bold text-red-700">{opportunity.value}</p>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {opportunity.tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-red-700 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <Badge className="bg-white text-red-700 hover:bg-white">Roseair Marketplace</Badge>
            <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">Um marketplace B2B onde fornecimento, confiança em agentes e execução de importação se unem.</h2>
            <p className="mt-4 max-w-2xl text-red-100">Explore produtos, publique RFQs, compare agentes e deixe a Roseair coordenar logística, desalfandegamento e armazenagem em cada transação.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button asChild size="lg" className="bg-white text-red-700 hover:bg-red-50">
              <Link to="/marketplace">Explorar Marketplace</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white hover:text-red-700" onClick={() => navigate("/marketplace")}>Publicar RFQ de Importação</Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-700 text-white">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold">Roseair Marketplace</p>
                <p className="text-xs uppercase tracking-[0.22em] text-red-700">Plataforma de importação B2B</p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">Conectando compradores, agentes chineses, logística, desalfandegamento e armazenagem para o comércio de Moçambique e SADC.</p>
          </div>
          <div>
            <p className="font-semibold">Navegação</p>
            <div className="mt-4 space-y-3 text-sm text-slate-500">
              <a className="block transition hover:text-red-700" href="#categories">Categorias</a>
              <a className="block transition hover:text-red-700" href="#products">Produtos em destaque</a>
              <a className="block transition hover:text-red-700" href="#agents">Agentes verificados</a>
              <Link className="block transition hover:text-red-700" to="/marketplace">Marketplace</Link>
              <Link className="block transition hover:text-red-700" to="/agent">Painel do Agente</Link>
              <Link className="block transition hover:text-red-700" to="/admin">Administração</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold">Operações Comerciais</p>
            <div className="mt-4 space-y-3 text-sm text-slate-500">
              <p>Logística</p>
              <p>Desalfandegamento</p>
              <p>Armazenagem</p>
            </div>
          </div>
          <div>
            <p className="font-semibold">Contacto</p>
            <div className="mt-4 space-y-3 text-sm text-slate-500">
              <p>Maputo, Moçambique</p>
              <p>support@roseair.market</p>
              <p>SLA de resposta: 48h</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
