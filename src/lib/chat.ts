export type ChatMessage = {
  id: string;
  orderId: string;
  sender: "buyer" | "agent";
  body: string;
  sentAt: string;
};

const CHAT_KEY = "roseair_chat_messages";

function readAll(): ChatMessage[] {
  try {
    return JSON.parse(localStorage.getItem(CHAT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeAll(messages: ChatMessage[]) {
  localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
}

/** Order-scoped thread, created implicitly on PaymentConfirmed (BR-CHT-01) — Roseair has full read visibility (BR-CHT-02), enforced at the query layer once a real backend exists. */
export function getMessagesForOrder(orderId: string): ChatMessage[] {
  return readAll()
    .filter((m) => m.orderId === orderId)
    .sort((a, b) => (a.sentAt < b.sentAt ? -1 : 1));
}

export function sendMessage(orderId: string, sender: ChatMessage["sender"], body: string) {
  const messages = readAll();
  messages.push({ id: crypto.randomUUID(), orderId, sender, body, sentAt: new Date().toISOString() });
  writeAll(messages);
}
