import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock3, ImagePlus, X } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { createAgentProduct } from "@/lib/agentProducts";

const categories = ["Energia", "Embalagens", "Armazenagem", "Peças Automóveis", "Serviços Alimentares", "Electrónica", "Construção", "Material Médico", "Agricultura", "Mobiliário", "Ferramentas e Ferragens", "Têxteis"];
const freightModes = ["Marítimo", "Aéreo", "Marítimo + Rodoviário"];
const warehouses = ["Centro Logístico de Maputo", "Parque Logístico da Matola", "Plataforma Logística da Beira"];
const stockStatuses = ["Stock Disponível", "Em Produção", "Stock Limitado"];
const docOptions = ["Certificado de Origem", "Fatura Comercial", "Packing List"];

export default function AgentNewProductPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [originCountry, setOriginCountry] = useState("");
  const [supplierCost, setSupplierCost] = useState("");
  const [moq, setMoq] = useState("");
  const [monthlyCapacity, setMonthlyCapacity] = useState("");
  const [leadTimeDays, setLeadTimeDays] = useState("");
  const [freightMode, setFreightMode] = useState("");
  const [destinationWarehouse, setDestinationWarehouse] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [documents, setDocuments] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleDoc = (doc: string) => {
    setDocuments((prev) => prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc]);
  };

  const handleImageUpload = () => {
    setImagePreview("https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop");
  };

  const isFormValid = () => {
    return name && category && description && brand && model && originCountry &&
      supplierCost && moq && monthlyCapacity && leadTimeDays &&
      freightMode && destinationWarehouse && stockStatus;
  };

  const handleSubmit = () => {
    createAgentProduct({
      name,
      category,
      description,
      brand,
      model,
      originCountry,
      supplierCost: Number(supplierCost),
      moq: Number(moq),
      monthlyCapacity: Number(monthlyCapacity),
      leadTimeDays: Number(leadTimeDays),
      freightMode,
      destinationWarehouse,
      stockStatus,
      documents,
      imageUrl: imagePreview,
    });
    setSubmitted(true);
    setTimeout(() => navigate("/agent"), 2200);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-950">
        <section className="mx-auto flex max-w-lg flex-col items-center px-6 py-32 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gold-100">
            <Clock3 className="h-10 w-10 text-gold-600" />
          </div>
          <h1 className="mt-8 text-3xl font-bold tracking-tight">Produto submetido para aprovação</h1>
          <p className="mt-4 text-slate-600">
            A Linkano irá rever o produto, calcular o preço final de marketplace (frete, desalfandegamento, comissão) e aprová-lo antes de ficar visível aos compradores.
          </p>
          <Button asChild className="mt-8 bg-brand-700 hover:bg-brand-800">
            <Link to="/agent">Voltar ao Painel do Agente</Link>
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <SiteHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <Button asChild variant="ghost" className="mb-6 text-brand-700 hover:bg-brand-50 hover:text-brand-800">
            <Link to="/agent"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Painel</Link>
          </Button>
          <Badge className="bg-brand-100 text-brand-800 hover:bg-brand-100">Submeter Produto</Badge>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">Novo Produto</h1>
          <p className="mt-2 text-slate-600">
            Preencha os detalhes do produto. A Linkano calcula o preço final de marketplace e aprova antes da publicação — os agentes não publicam directamente.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="space-y-8">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-xl">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Nome do Produto *</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Painéis Solares Monocristalinos 550W" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Categoria *</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue placeholder="Selecionar categoria" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">País de Origem *</label>
                <Input value={originCountry} onChange={(e) => setOriginCountry(e.target.value)} placeholder="Ex: China" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Descrição *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o produto, especificações técnicas, condições de fornecimento..."
                  className="flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Marca *</label>
                <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Ex: LONGi, Jinko, Trina" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Modelo *</label>
                <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Ex: LR5-72HPH-550M" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-xl">Comercial</CardTitle>
              <p className="text-sm text-slate-500">
                Indique apenas o seu custo de fornecedor. A Linkano adiciona frete, CBM, custos operacionais, seguro e comissão para calcular o preço final de marketplace — nunca visível ao comprador.
              </p>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Custo de Fornecedor (USD) *</label>
                <Input type="number" min={0} value={supplierCost} onChange={(e) => setSupplierCost(e.target.value)} placeholder="0.00" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Quantidade Mínima (MOQ) *</label>
                <Input type="number" min={1} value={moq} onChange={(e) => setMoq(e.target.value)} placeholder="Ex: 100" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Capacidade Mensal de Fornecimento *</label>
                <Input type="number" min={0} value={monthlyCapacity} onChange={(e) => setMonthlyCapacity(e.target.value)} placeholder="Ex: 5000" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Prazo de Produção (dias) *</label>
                <Input type="number" min={1} value={leadTimeDays} onChange={(e) => setLeadTimeDays(e.target.value)} placeholder="Ex: 25" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-xl">Logística</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Modo de Transporte *</label>
                <Select value={freightMode} onValueChange={setFreightMode}>
                  <SelectTrigger><SelectValue placeholder="Selecionar modo" /></SelectTrigger>
                  <SelectContent>
                    {freightModes.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Armazém de Destino *</label>
                <Select value={destinationWarehouse} onValueChange={setDestinationWarehouse}>
                  <SelectTrigger><SelectValue placeholder="Selecionar armazém" /></SelectTrigger>
                  <SelectContent>
                    {warehouses.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-xl">Estado Operacional</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {stockStatuses.map((s) => (
                  <label key={s} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 px-5 py-3 text-sm transition has-[:checked]:border-brand-300 has-[:checked]:bg-brand-50">
                    <input
                      type="radio"
                      name="stockStatus"
                      checked={stockStatus === s}
                      onChange={() => setStockStatus(s)}
                      className="h-4 w-4 accent-brand-700"
                    />
                    {s}
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-xl">Documentação</CardTitle>
              <p className="text-sm text-slate-500">Selecione os documentos disponíveis para este produto.</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-6">
                {docOptions.map((doc) => (
                  <label key={doc} className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
                    <Checkbox checked={documents.includes(doc)} onCheckedChange={() => toggleDoc(doc)} />
                    {doc}
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-xl">Imagens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={handleImageUpload}
                  className="flex h-36 w-48 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 transition hover:border-brand-300 hover:text-brand-700"
                >
                  <ImagePlus className="h-8 w-8" />
                  <span className="text-sm font-medium">Upload de Imagem</span>
                </button>
                {imagePreview && (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="h-36 w-48 rounded-2xl object-cover shadow-sm" />
                    <button
                      type="button"
                      onClick={() => setImagePreview("")}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-700 text-white shadow-sm"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Separator />

          <div className="flex flex-col gap-3 pb-12 sm:flex-row sm:justify-end">
            <Button className="bg-brand-700 hover:bg-brand-800" onClick={handleSubmit} disabled={!isFormValid()}>
              <CheckCircle2 className="mr-2 h-4 w-4" /> Submeter para Aprovação
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
