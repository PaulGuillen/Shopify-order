export const statusLabelMap: Record<string, string> = {
    unassigned: "Sin asignar",
    to_contact: "Por contactar",
    contacted: "Contactado",
    confirmed: "Confirmado",
    shipped: "Enviado",
    delivered: "Entregado",
    cancelled: "Cancelado",
    not_delivered: "No entregado",
};

export const statusConfig: Record<string, { label: string; color: string }> = {
    unassigned: { label: "Sin asignar", color: "#9ca3af" },
    to_contact: { label: "Por contactar", color: "#facc15" },
    contacted: { label: "Contactado", color: "#22c55e" },
    confirmed: { label: "Confirmado", color: "#3b82f6" },
    shipped: { label: "Enviado", color: "#8b5cf6" },
    delivered: { label: "Entregado", color: "#10b981" },
    cancelled: { label: "Cancelado", color: "#ef4444" },
    not_delivered: { label: "No entregado", color: "#f97316" },
};