type OrderItemMessage = {
  name: string;
  quantity: number;
};

type BaseMessage = {
  customerName: string;
  address: string;
  city?: string;
  phone: string;
  payment: string;
  total?: number;
};

export function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

export function buildStandardOrderMessage(
  base: BaseMessage,
  items: OrderItemMessage[],
) {
  const lines: string[] = [
    "NOVO PEDIDO - REALIZHE REAL FOOD",
    `Nome: ${base.customerName}`,
    `Telefone: ${base.phone}`,
    `Endereco: ${base.address}${base.city ? ` - ${base.city}` : ""}`,
    "",
    "Pedido:",
  ];

  items.forEach((item) => {
    lines.push(`- ${item.quantity}x ${item.name}`);
  });

  if (typeof base.total === "number") {
    lines.push("", `Valor estimado: R$ ${base.total.toFixed(2)}`);
  }

  lines.push(`Forma de pagamento: ${base.payment}`);
  return encodeURIComponent(lines.join("\n"));
}

export function buildCustomPlanMessage(
  base: BaseMessage,
  summary: string,
  attachmentUrl?: string,
) {
  const lines: string[] = [
    "NOVO PLANO PERSONALIZADO - REALIZHE REAL FOOD",
    `Nome: ${base.customerName}`,
    `Telefone: ${base.phone}`,
    `Endereco: ${base.address}${base.city ? ` - ${base.city}` : ""}`,
    "",
    "Resumo:",
    summary,
    "",
    `Forma de pagamento sugerida: ${base.payment}`,
  ];
  if (attachmentUrl) {
    lines.push("", `Arquivo enviado: ${attachmentUrl}`);
  }
  return encodeURIComponent(lines.join("\n"));
}

