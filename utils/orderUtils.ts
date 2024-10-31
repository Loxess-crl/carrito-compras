import { OrderState } from "@/types/order.interface";

export const ORDER_STATES = [
  { value: "P", label: "Pendiente", color: "#FFA500", bgColor: "#FFF3E0" },
  { value: "C", label: "Confirmado", color: "#2196F3", bgColor: "#E3F2FD" },
  { value: "E", label: "En camino", color: "#9C27B0", bgColor: "#F3E5F5" },
  { value: "Eo", label: "Entregado", color: "#4CAF50", bgColor: "#E8F5E9" },
];
export const getOrderStateInfo = (state: OrderState) => {
  return ORDER_STATES.find((s) => s.value === state)!;
};
