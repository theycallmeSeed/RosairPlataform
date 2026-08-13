import { products } from "@/data/products";
import { type CartLineWithProduct, clearCart } from "@/lib/cart";

/**
 * Mirrors business-rules.md §8 (Order Lifecycle Rules). Statuses are strictly
 * forward-only; Cancelled is a separate terminal exception (BR-ORD-02).
 */
export type OrderStatus =
  | "PendingPayment"
  | "PaymentConfirmed"
  | "PreparingShipment"
  | "Shipped"
  | "TrackingActive"
  | "ArrivedAtPort"
  | "CustomsClearance"
  | "Delivered"
  | "Cancelled";

export const ORDER_STAGES: { status: OrderStatus; label: string }[] = [
  { status: "PendingPayment", label: "Pagamento Pendente" },
  { status: "PaymentConfirmed", label: "Pagamento Confirmado" },
  { status: "PreparingShipment", label: "A Preparar Envio" },
  { status: "Shipped", label: "Enviado" },
  { status: "TrackingActive", label: "Em Trânsito" },
  { status: "ArrivedAtPort", label: "Chegou ao Porto" },
  { status: "CustomsClearance", label: "Desalfandegamento" },
  { status: "Delivered", label: "Entregue" },
];

export const orderStatusLabel = (status: OrderStatus): string =>
  status === "Cancelled" ? "Cancelada" : ORDER_STAGES.find((s) => s.status === status)?.label ?? status;

export type PaymentMethod = "M-Pesa" | "e-Mola" | "Transferência Bancária";

export type OrderLine = {
  productId: string;
  productName: string;
  agent: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type TrackingEvent = {
  status: OrderStatus;
  label: string;
  occurredAt: string;
  note?: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  lines: OrderLine[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  isDisputed: boolean;
  createdAt: string;
  paymentConfirmedAt?: string;
  deliveredAt?: string;
  trackingEvents: TrackingEvent[];
  /** Bank Transfer only — requires manual Admin reconciliation, BR-PAY-05. */
  proofOfPaymentUploaded?: boolean;
};

export type Invoice = {
  invoiceNumber: string;
  orderId: string;
  issuedAt: string;
  status: "ProForma" | "Finalized";
  lines: OrderLine[];
  totalAmount: number;
};

const ORDERS_KEY = "linkano_orders";

function readOrders(): Order[] {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeOrders(orders: Order[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event("linkano_orders_updated"));
}

export function getOrders(): Order[] {
  return readOrders().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getOrderById(id: string): Order | undefined {
  return readOrders().find((o) => o.id === id);
}

export function getInvoiceForOrder(order: Order): Invoice {
  return {
    invoiceNumber: order.orderNumber.replace("ORD-", "INV-"),
    orderId: order.id,
    issuedAt: order.createdAt,
    status: order.status === "PendingPayment" ? "ProForma" : "Finalized",
    lines: order.lines,
    totalAmount: order.totalAmount,
  };
}

/**
 * Purchase -> Payment -> Invoice Generation -> Checkout Confirmation (business.md §5).
 * M-Pesa/e-Mola confirm near-instantly in this mock; Bank Transfer requires
 * manual Admin reconciliation (BR-PAY-05) and stays PendingPayment.
 */
export function createOrderFromCart(cartLines: CartLineWithProduct[], paymentMethod: PaymentMethod): Order {
  const now = new Date().toISOString();
  const orders = readOrders();
  const orderNumber = `ORD-${String(orders.length + 1).padStart(4, "0")}`;

  const lines: OrderLine[] = cartLines.map((line) => ({
    productId: line.product.id,
    productName: line.product.name,
    agent: line.product.agent,
    quantity: line.quantity,
    unitPrice: line.product.price,
    lineTotal: line.product.price * line.quantity,
  }));

  const isInstantMethod = paymentMethod === "M-Pesa" || paymentMethod === "e-Mola";

  const order: Order = {
    id: crypto.randomUUID(),
    orderNumber,
    lines,
    totalAmount: lines.reduce((sum, l) => sum + l.lineTotal, 0),
    paymentMethod,
    status: isInstantMethod ? "PaymentConfirmed" : "PendingPayment",
    isDisputed: false,
    createdAt: now,
    paymentConfirmedAt: isInstantMethod ? now : undefined,
    trackingEvents: isInstantMethod
      ? [{ status: "PaymentConfirmed", label: orderStatusLabel("PaymentConfirmed"), occurredAt: now }]
      : [],
  };

  writeOrders([...orders, order]);
  clearCart();
  return order;
}

/** Admin action — manual Bank Transfer reconciliation (BR-PAY-05). */
export function confirmBankTransferPayment(orderId: string) {
  const now = new Date().toISOString();
  const orders = readOrders().map((o) =>
    o.id === orderId && o.status === "PendingPayment"
      ? {
          ...o,
          status: "PaymentConfirmed" as OrderStatus,
          paymentConfirmedAt: now,
          trackingEvents: [...o.trackingEvents, { status: "PaymentConfirmed" as OrderStatus, label: orderStatusLabel("PaymentConfirmed"), occurredAt: now }],
        }
      : o,
  );
  writeOrders(orders);
}

/** Agent/Admin operational action — advances Order strictly forward (BR-ORD-01). */
export function advanceOrderStatus(orderId: string, nextStatus: OrderStatus, note?: string) {
  const now = new Date().toISOString();
  const orders = readOrders().map((o) => {
    if (o.id !== orderId) return o;
    return {
      ...o,
      status: nextStatus,
      deliveredAt: nextStatus === "Delivered" ? now : o.deliveredAt,
      trackingEvents: [...o.trackingEvents, { status: nextStatus, label: orderStatusLabel(nextStatus), occurredAt: now, note }],
    };
  });
  writeOrders(orders);
}

/** Admin operational override — only legal from PendingPayment or as an explicit exception (BR-ORD-02). */
export function cancelOrder(orderId: string, reason: string) {
  const now = new Date().toISOString();
  const orders = readOrders().map((o) =>
    o.id === orderId
      ? { ...o, status: "Cancelled" as OrderStatus, trackingEvents: [...o.trackingEvents, { status: "Cancelled" as OrderStatus, label: "Cancelada", occurredAt: now, note: reason }] }
      : o,
  );
  writeOrders(orders);
}

export function ordersForAgent(agentName: string): Order[] {
  return getOrders().filter((o) => o.lines.some((l) => l.agent === agentName));
}

export const allProductAgents = () => new Set(products.map((p) => p.agent));
