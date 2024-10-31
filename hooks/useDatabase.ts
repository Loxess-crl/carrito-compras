import { API_URL } from "@/constants/constants";
import { database } from "@/firebase/client";
import { ref, set } from "firebase/database";
import { Order } from "@/types/order.interface";
import { API_ROUTES } from "@/constants/api_routes.enum";

export const createOrder = async (order: Order) => {
  /* Primero se guarda en el servidor simulado (json-server) */
  const response = await fetch(`${API_URL}/${API_ROUTES.ORDERS}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  const orderCreated: Order = await response.json();

  /* Se guarda en Realtime Database para sincronizarlo */
  const orderRef = ref(database, `${API_ROUTES.ORDERS}/${orderCreated.id}`);
  await set(orderRef, order);

  return orderCreated;
};

export const getOrders = async () => {
  const response = await fetch(`${API_URL}/${API_ROUTES.ORDERS}`);
  const orders: Order[] = await response.json();

  return orders;
};

export const getOrder = async (id: string) => {
  const response = await fetch(`${API_URL}/${API_ROUTES.ORDERS}?id=${id}`);
  const order: Order = await response.json();

  return order;
};

export const updateOrder = async (order: Order) => {
  /* Primero se actualiza en el servidor simulado (json-server) */
  await fetch(`${API_URL}/${API_ROUTES.ORDERS}/${order.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });
  /* Se actualiza en Realtime Database para sincronizarlo */
  const orderRef = ref(database, `${API_ROUTES.ORDERS}/${order.id}`);
  await set(orderRef, order);

  return order;
};
