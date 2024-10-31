// hooks/useOrders.ts
import { useEffect, useState } from "react";
import { fetchAllOrders, fetchOrdersForUser } from "../services/orderService";
import { Order } from "@/types/order.interface";
import { useAuthContext } from "@/context/AuthContext";

const useOrders = () => {
  const { user } = useAuthContext();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) {
      const fetchOrders = () => {
        fetchOrdersForUser(user.id, setOrders);
      };

      fetchOrders();

      return () => {
        setOrders([]);
      };
    }
  }, [user]);

  return orders;
};

export const useAllOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = () => {
      fetchAllOrders(setOrders);
    };

    fetchOrders();

    return () => {
      setOrders([]);
    };
  }, []);

  return orders;
};

export default useOrders;
