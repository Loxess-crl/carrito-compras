// hooks/useUpdateOrder.ts
import { useState } from "react";
import { updateOrderStatus } from "../services/orderService";
import { OrderState } from "@/types/order.interface";

const useUpdateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changeOrderStatus = async (
    orderId: string,
    userId: string,
    newState: OrderState
  ) => {
    setLoading(true);
    setError(null);
    try {
      await updateOrderStatus(orderId, userId, newState);
    } catch (err) {
      setError("Error al actualizar el estado del pedido.");
    } finally {
      setLoading(false);
    }
  };

  return { changeOrderStatus, loading, error };
};

export default useUpdateOrder;
