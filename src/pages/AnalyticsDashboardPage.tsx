import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Boxes,
  Building2,
  CheckCircle2,
  Clock3,
  Globe2,
  LineChart,
  MapPin,
  PackageSearch,
  Search,
  ShieldCheck,
  Ship,
  ShoppingCart,
  TrendingUp,
  Users,
  Warehouse,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const executiveKpis = [
  { label: "Pesquisas este mês", value: "18,420", change: "+31%", icon: Search },
  { label: "RFQs qualificados", value: "1,284", change: "+22%", icon: ShoppingCart },
  { label: "Valor de lacuna de fornecedores", value: "USD 4.7M", change: "Alto", icon: AlertTriangle },
  { label: "Fluxo de oportunidades de importação", value: "USD 8.9M", change: "+18%", icon: TrendingUp },
];

const topSearches = [
  { term: "solar inverters", category: "Energia", searches: 2380, growth: "+42%", country: "Moçambique", intent: "Alta intenção de RFQ" },
  { term: "motorcycle spare parts", category: "Peças Automóveis", searches: 1910, growth: "+28%", country: "Zâmbia", intent: "Procura de distribuidor" },
  { term: "ceramic floor tiles", category: "Construção", searches: 1744, growth: "+19%", country: "Moçambique", intent: "Compra em massa" },
  { term: "retail packaging cartons", category: "Embalagens", searches: 1468, growth: "+35%", country: "Zimbábue", intent: "Compradores recorrentes" },
  { term: "cold room equipment", category: "Logística Alimentar", searches: 1216, growth: "+24%", country: "Maláui", intent: "Procura de projeto" },
  { term: "water pumps", category: "Agricultura", searches: 1102, growth: "+21%", country: "Moçambique", intent: "Procura sazonal" },
];

const productsWithoutSuppliers = [
  { product: "Irrigation pump sets", category: "Agricultura", searches: 842, rfqs: 74, value: "USD 620K", urgency: "Crítico" },
  { product: "Lithium battery storage units", category: "Energia", searches: 779, rfqs: 61, value: "USD 940K", urgency: "Crítico" },
  { product: "Rice milling machines", category: "Agro-processamento", searches: 624, rfqs: 48, value: "USD 510K", urgency: "Alto" },
  { product: "PVC resin for manufacturers", category: "Fornecimento Industrial", searches: 518, rfqs: 39, value: "USD 730K", urgency: "Alto" },
  { product: "Medical display refrigerators", category: "Fornecimento Médico", searches: 406, rfqs: 34, value: "USD 360K", urgency: "Médio" },
];

const demandByCategory = [
  { category: "Energia", searches: 4260, rfqs: 318, conversion: 7.5, opportunity: "USD 2.4M" },
  { category: "Construção", searches: 3810, rfqs: 274, conversion: 7.2, opportunity: "USD 1.9M" },
  { category: "Peças Auto", searches: 3325, rfqs: 226, conversion: 6.8, opportunity: "USD 1.3M" },
  { category: "Embalagem", searches: 2844, rfqs: 211, conversion: 7.4, opportunity: "USD 820K" },
  { category: "Agricultura", searches: 2140, rfqs: 166, conversion: 7.8, opportunity: "USD 1.1M" },
  { category: "Logística Alimentar", searches: 1642, rfqs: 122, conversion: 7.4, opportunity: "USD 760K" },
];

const demandByCountry = [
  { country: "Moçambique", city: "Maputo / Beira", searches: 6840, rfqs: 486, share: 37, topCategory: "Energia" },
  { country: "Zâmbia", city: "Lusaca / Copperbelt", searches: 3320, rfqs: 238, share: 18, topCategory: "Peças Auto" },
  { country: "Zimbábue", city: "Harare / Bulawayo", searches: 2760, rfqs: 204, share: 15, topCategory: "Embalagem" },
  { country: "Maláui", city: "Lilongwe / Blantyre", searches: 1886, rfqs: 143, share: 10, topCategory: "Agricultura" },
  { country: "África do Sul", city: "Joanesburgo / Durban", searches: 1664, rfqs: 108, share: 9, topCategory: "Eletrónica" },
  { country: "Botsuana", city: "Gaborone", searches: 1012, rfqs: 71, share: 6, topCategory: "Construção" },
];

const monthlySearchGrowth = [
  { month: "Jan", searches: 9200, rfqs: 612 },
  { month: "Fev", searches: 10480, rfqs: 704 },
  { month: "Mar", searches: 12140, rfqs: 816 },
  { month: "Abr", searches: 13980, rfqs: 932 },
  { month: "Mai", searches: 15860, rfqs: 1088 },
  { month: "Jun", searches: 18420, rfqs: 1284 },
];

const importOpportunities = [
  {
    title: "Distribuidores solares de Moçambique precisam de kits de inversores e baterias",
    country: "Moçambique",
    category: "Energia",
    value: "USD 1.6M",
    buyers: "42 compradores",
    route: "Shenzhen / Guangzhou para Maputo",
    service: "Frete marítimo + alfândega + armazenagem Maputo",
    confidence: 92,
  },
  {
    title: "Grossistas de peças auto da Zâmbia a fornecer kits de serviço para motos",
    country: "Zâmbia",
    category: "Peças Auto",
    value: "USD 980K",
    buyers: "31 compradores",
    route: "Guangzhou para Lusaca via corredor Maputo",
    service: "Consolidação + coordenação de entrega rodoviária",
    confidence: 84,
  },
  {
    title: "Retalhistas do Zimbábue a solicitar caixas de embalagem de marca própria",
    country: "Zimbábue",
    category: "Embalagem",
    value: "USD 740K",
    buyers: "27 compradores",
    route: "Ningbo para Beira / corredor Harare",
    service: "CIF Beira + apoio documentação aduaneira",
    confidence: 79,
  },
  {
    title: "Compradores agrícolas do Maláui a pesquisar bombas de irrigação e água",
    country: "Maláui",
    category: "Agricultura",
    value: "USD 690K",
    buyers: "19 compradores",
    route: "Xangai para Beira / corredor Blantyre",
    service: "Frete a granel + revisão de licença de importação",
    confidence: 76,
  },
];

const maxSearches = Math.max(...monthlySearchGrowth.map((item) => item.searches));
const maxCategorySearches = Math.max(...demandByCategory.map((item) => item.searches));

export default function AnalyticsDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Analíticas Executivas</Badge>
              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Inteligência de Procura do Marketplace</h1>
              <p className="mt-3 max-w-3xl text-slate-600">
                Comportamento de pesquisa de compradores em tempo real, lacunas de fornecedores, procura por país e oportunidades de importação nos corredores comerciais de Moçambique e SADC.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-slate-300">Exportar Relatório</Button>
              <Button className="bg-red-700 hover:bg-red-800">Abrir Fluxo de Oportunidades</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {executiveKpis.map((kpi) => {
            const KpiIcon = kpi.icon;

            return (
              <Card key={kpi.label} className="border-slate-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-700">
                      <KpiIcon className="h-5 w-5" />
                    </div>
                    <Badge className="bg-red-50 text-red-700 hover:bg-red-50">{kpi.change}</Badge>
                  </div>
                  <p className="mt-5 text-3xl font-bold tracking-tight">{kpi.value}</p>
                  <p className="mt-1 text-sm font-medium text-slate-500">{kpi.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <Card className="border-slate-200 bg-white">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-red-700" /> Principais Pesquisas
                  </CardTitle>
                  <p className="mt-2 text-sm text-slate-500">Pesquisas de produtos com maior intenção entre compradores do marketplace.</p>
                </div>
                <Badge variant="outline">Últimos 30 dias</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="hidden grid-cols-[1fr_140px_110px_130px] border-b border-slate-100 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
                <span>Termo de pesquisa</span>
                <span>País</span>
                <span>Pesquisas</span>
                <span>Sinal</span>
              </div>
              {topSearches.map((item) => (
                <div key={item.term} className="grid gap-4 border-b border-slate-100 px-6 py-4 last:border-0 md:grid-cols-[1fr_140px_110px_130px] md:items-center">
                  <div>
                    <p className="font-semibold capitalize">{item.term}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="outline">{item.category}</Badge>
                      <Badge className="bg-red-50 text-red-700 hover:bg-red-50">{item.growth}</Badge>
                    </div>
                  </div>
                  <p className="flex items-center gap-2 text-sm text-slate-600"><MapPin className="h-4 w-4 text-red-700" /> {item.country}</p>
                  <p className="text-sm font-bold">{item.searches.toLocaleString()}</p>
                  <p className="text-sm text-slate-600">{item.intent}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-red-700" /> Crescimento Mensal de Pesquisas
                  </CardTitle>
                  <p className="mt-2 text-sm text-slate-500">Crescimento de pesquisas e momentum de conversão de RFQs no marketplace.</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">+100% proxy YoY</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid h-80 grid-cols-6 items-end gap-3 rounded-3xl bg-slate-50 p-5">
                {monthlySearchGrowth.map((item) => (
                  <div key={item.month} className="flex h-full flex-col justify-end gap-3">
                    <div className="flex flex-1 items-end rounded-b-xl bg-white p-1 shadow-sm">
                      <div className="w-full rounded-t-xl bg-red-700" style={{ height: `${(item.searches / maxSearches) * 100}%` }} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-semibold text-slate-900">{item.month}</p>
                      <p className="text-[11px] text-slate-500">{Math.round(item.searches / 1000)}K</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">Pesquisas em Junho</p>
                  <p className="mt-1 text-2xl font-bold">18,420</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">RFQs em Junho</p>
                  <p className="mt-1 text-2xl font-bold">1,284</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card className="border-slate-200 bg-white">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-700" /> Produtos Sem Fornecedores
              </CardTitle>
              <p className="text-sm text-slate-500">Sinais de procura onde a atividade do comprador excede a cobertura de agentes chineses ativos.</p>
            </CardHeader>
            <CardContent className="space-y-3 p-6">
              {productsWithoutSuppliers.map((item) => (
                <div key={item.product} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{item.product}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.category}</p>
                    </div>
                    <Badge className={item.urgency === "Crítico" ? "bg-red-100 text-red-800 hover:bg-red-100" : "bg-amber-100 text-amber-800 hover:bg-amber-100"}>
                      {item.urgency}
                    </Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-slate-500">Pesquisas</p>
                      <p className="font-bold">{item.searches}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-slate-500">RFQs</p>
                      <p className="font-bold">{item.rfqs}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-slate-500">Valor</p>
                      <p className="font-bold text-red-700">{item.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-red-700" /> Procura por Categoria
              </CardTitle>
              <p className="text-sm text-slate-500">Procura por categoria classificada por pesquisas, RFQs e oportunidade de importação estimada.</p>
            </CardHeader>
            <CardContent className="space-y-5 p-6">
              {demandByCategory.map((item) => (
                <div key={item.category}>
                  <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div>
                      <p className="font-semibold">{item.category}</p>
                      <p className="text-sm text-slate-500">{item.searches.toLocaleString()} pesquisas • {item.rfqs} RFQs • {item.conversion}% conversão de RFQ</p>
                    </div>
                    <p className="font-bold text-red-700">{item.opportunity}</p>
                  </div>
                  <Progress value={(item.searches / maxCategorySearches) * 100} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <Card className="border-slate-200 bg-white">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-red-700" /> Procura por País
              </CardTitle>
              <p className="text-sm text-slate-500">Concentração de procura do marketplace nos mercados compradores de Moçambique e SADC.</p>
            </CardHeader>
            <CardContent className="p-0">
              {demandByCountry.map((item) => (
                <div key={item.country} className="grid gap-4 border-b border-slate-100 px-6 py-5 last:border-0 md:grid-cols-[1fr_130px_100px_140px] md:items-center">
                  <div>
                    <p className="font-semibold">{item.country}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Pesquisas</p>
                    <p className="font-bold">{item.searches.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">RFQs</p>
                    <p className="font-bold">{item.rfqs}</p>
                  </div>
                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-medium">{item.share}% quota</span>
                      <span className="text-slate-500">{item.topCategory}</span>
                    </div>
                    <Progress value={item.share} className="h-2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-slate-950 text-white">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-red-300" /> Análises Executivas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {[
                [TrendingUp, "Energia é a categoria mais forte a curto prazo", "Produtos solares e armazenamento de baterias representam 27% do valor de RFQ qualificado."],
                [Users, "Recrutamento de agentes deve focar lacunas de fornecedores", "Equipamento agrícola e armazenamento de baterias precisam de agentes chineses verificados imediatamente."],
                [Ship, "Corredores de Maputo e Beira continuam estratégicos", "A procura de Moçambique representa 37% das pesquisas e ancora o cumprimento regional da SADC."],
                [Warehouse, "Disponibilidade de armazém influencia conversão", "Anúncios com opções de armazenagem declaradas convertem 18% melhor do que anúncios apenas de produto."],
              ].map(([Icon, title, text]) => {
                const InsightIcon = Icon as typeof TrendingUp;

                return (
                  <div key={String(title)} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex gap-3">
                      <InsightIcon className="h-5 w-5 shrink-0 text-red-300" />
                      <div>
                        <p className="font-semibold">{String(title)}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{String(text)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 border-slate-200 bg-white">
          <CardHeader className="border-b border-slate-100">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <PackageSearch className="h-5 w-5 text-red-700" /> Oportunidades de Importação
                </CardTitle>
                <p className="mt-2 text-sm text-slate-500">Pipeline executivo de procura de alto valor do marketplace pronta para correspondência com agentes e execução comercial Roseair.</p>
              </div>
              <Button className="bg-red-700 hover:bg-red-800">
                Priorizar Oportunidades <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-5 p-6 lg:grid-cols-2">
            {importOpportunities.map((opportunity) => (
              <Card key={opportunity.title} className="border-slate-200 bg-slate-50 shadow-none">
                <CardContent className="p-5">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{opportunity.category}</Badge>
                      <h3 className="mt-4 text-lg font-semibold leading-7">{opportunity.title}</h3>
                      <p className="mt-2 flex items-center gap-2 text-sm text-slate-500"><MapPin className="h-4 w-4 text-red-700" /> {opportunity.country}</p>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-3 text-right shadow-sm">
                      <p className="text-xs text-slate-500">Valor est.</p>
                      <p className="text-xl font-bold text-red-700">{opportunity.value}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-slate-500">Sinal do comprador</p>
                      <p className="font-semibold">{opportunity.buyers}</p>
                    </div>
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-slate-500">Rota</p>
                      <p className="font-semibold">{opportunity.route}</p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl bg-white p-3 text-sm">
                    <p className="text-slate-500">Camada de serviço Roseair</p>
                    <p className="font-semibold">{opportunity.service}</p>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-medium">Confiança na oportunidade</span>
                      <span className="text-slate-500">{opportunity.confidence}%</span>
                    </div>
                    <Progress value={opportunity.confidence} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {[
            [Building2, "Foco em recrutamento de agentes", "Recrutar fornecedores para armazenamento de energia, irrigação e equipamentos de agro-processamento."],
            [Boxes, "Foco em expansão de catálogo", "Adicionar categorias em falta onde a cobertura pesquisa-fornecedor é inferior a 65%."],
            [Clock3, "Prioridade executiva trimestral", "Converter os principais RFQs em programas de compradores recorrentes em Maputo, Beira, Lusaca e Harare."],
          ].map(([Icon, title, text]) => {
            const ActionIcon = Icon as typeof Building2;

            return (
              <Card key={String(title)} className="border-red-100 bg-white">
                <CardContent className="p-6">
                  <ActionIcon className="h-6 w-6 text-red-700" />
                  <h3 className="mt-4 font-semibold">{String(title)}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{String(text)}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-red-700">
                    <CheckCircle2 className="h-4 w-4" /> Ação pronta para apresentação
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}
