import { products, type Product } from "@/data/products";

export type CartLine = {
  productId: string;
  quantity: number;
};

export type CartLineWithProduct = CartLine & { product: Product };

const CART_KEY = "linkano_cart";

function readCart(): CartLine[] {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeCart(lines: CartLine[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(lines));
  window.dispatchEvent(new Event("linkano_cart_updated"));
}

export function getCart(): CartLine[] {
  return readCart();
}

export function getCartWithProducts(): CartLineWithProduct[] {
  return readCart()
    .map((line) => {
      const product = products.find((p) => p.id === line.productId);
      return product ? { ...line, product } : null;
    })
    .filter((line): line is CartLineWithProduct => line !== null);
}

export function getCartCount(): number {
  return readCart().length;
}

export function addToCart(productId: string, quantity: number) {
  const lines = readCart();
  const existing = lines.find((l) => l.productId === productId);
  if (existing) {
    existing.quantity = quantity;
  } else {
    lines.push({ productId, quantity });
  }
  writeCart(lines);
}

export function updateCartQuantity(productId: string, quantity: number) {
  const lines = readCart().map((l) => (l.productId === productId ? { ...l, quantity } : l));
  writeCart(lines);
}

export function removeFromCart(productId: string) {
  writeCart(readCart().filter((l) => l.productId !== productId));
}

export function clearCart() {
  writeCart([]);
}

export function getCartTotal(): number {
  return getCartWithProducts().reduce((sum, line) => sum + line.product.price * line.quantity, 0);
}

/** Distinct agents represented in the cart — an Order will be split into one Shipment per Agent. */
export function getCartAgentCount(): number {
  return new Set(getCartWithProducts().map((line) => line.product.agent)).size;
}
