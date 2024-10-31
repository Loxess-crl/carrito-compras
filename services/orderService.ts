import { API_ROUTES } from "@/constants/api_routes.enum";
import { database } from "@/firebase/client";
import { Order, OrderState } from "@/types/order.interface";
import { onValue, ref, set } from "firebase/database";

export const fetchOrdersForUser = (
  userId: string,
  callback: (orders: Order[]) => void
) => {
  const ordersRef = ref(database, `${API_ROUTES.ORDERS}/${userId}`);
  onValue(ordersRef, (snapshot) => {
    const ordersData = snapshot.val();
    if (ordersData) {
      const orders: Order[] = Object.values(ordersData);
      callback(orders);
    } else {
      callback([]);
    }
  });
};

export const createOrder = async (order: Order) => {
  const newOrderRef = ref(
    database,
    `${API_ROUTES.ORDERS}/${order.user.id}/${order.id}`
  );
  await set(newOrderRef, order);
};

export const updateOrderStatus = async (
  orderId: string,
  userId: string,
  newState: OrderState
) => {
  const orderRef = ref(
    database,
    `${API_ROUTES.ORDERS}/${userId}/${orderId}/state`
  );
  await set(orderRef, newState);
};

export const fetchAllOrders = (callback: (orders: Order[]) => void) => {
  const ordersRef = ref(database, API_ROUTES.ORDERS);
  onValue(ordersRef, (snapshot) => {
    const ordersData: Order = snapshot.val();
    if (ordersData) {
      const orders: Order[] = Object.values(ordersData).flatMap(
        (userOrders: Record<string, Order>) => Object.values(userOrders)
      );
      callback(orders);
    } else {
      callback([]);
    }
  });
};
