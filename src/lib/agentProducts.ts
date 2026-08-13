/**
 * Mock client-side implementation of the Agent product approval workflow
 * (business-rules.md §4). Agents cannot self-publish (BR-PRD-01): a product
 * moves Draft -> Submitted -> Published/Rejected only via Admin action.
 *
 * This mock collapses the full UnderReview / Pricing Engine approval
 * sub-workflow (pricing-engine.md) into a single Admin decision, since there
 * is no backend pricing service to calculate a Marketplace Price here.
 */
export type AgentProductStatus = "Draft" | "Submitted" | "Published" | "Rejected";

export type AgentProduct = {
  id: string;
  name: string;
  category: string;
  description: string;
  brand: string;
  model: string;
  originCountry: string;
  /** Only the Agent's own supplier cost — Linkano adds freight/CBM/operational/commission before publishing (pricing-engine.md). */
  supplierCost: number;
  moq: number;
  monthlyCapacity: number;
  leadTimeDays: number;
  freightMode: string;
  destinationWarehouse: string;
  stockStatus: string;
  documents: string[];
  imageUrl: string;
  status: AgentProductStatus;
  rejectionReason?: string;
  createdAt: string;
};

const STORAGE_KEY = "linkano_agent_products";

export function loadAgentProducts(): AgentProduct[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveAgentProducts(items: AgentProduct[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function createAgentProduct(input: Omit<AgentProduct, "id" | "status" | "createdAt">): AgentProduct {
  const existing = loadAgentProducts();
  const product: AgentProduct = {
    ...input,
    id: `AGT-PRD-${String(existing.length + 1).padStart(3, "0")}`,
    status: "Submitted",
    createdAt: new Date().toISOString().split("T")[0],
  };
  saveAgentProducts([...existing, product]);
  return product;
}

export function approveAgentProduct(id: string) {
  saveAgentProducts(loadAgentProducts().map((p) => (p.id === id ? { ...p, status: "Published" as const, rejectionReason: undefined } : p)));
}

export function rejectAgentProduct(id: string, reason: string) {
  saveAgentProducts(loadAgentProducts().map((p) => (p.id === id ? { ...p, status: "Rejected" as const, rejectionReason: reason } : p)));
}

export const agentProductStatusLabel: Record<AgentProductStatus, string> = {
  Draft: "Rascunho",
  Submitted: "Aguarda Aprovação Linkano",
  Published: "Publicado",
  Rejected: "Rejeitado",
};
