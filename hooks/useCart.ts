// src/hooks/useCart.ts

import { useEffect, useState } from "react";
import {
  addToCart,
  updateCartItem,
  removeFromCart,
  fetchCart,
  deleteCart,
} from "../services/cartService";
import { Product } from "@/types/product.interface";
import { useAuthContext } from "@/context/AuthContext";
import { CartItem } from "@/types/cart.interface";

const useCart = () => {
  const { user } = useAuthContext();
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      const loadCart = async () => {
        setLoading(true);
        const cartData = await fetchCart(user.id);
        if (cartData) {
          setCart(cartData);
        }
        setLoading(false);
      };
      loadCart();
    }
  }, [user]);

  const addProductToCart = async (product: Product, quantity: number) => {
    if (!user) return;
    await addToCart(user.id, product.id.toString(), quantity, product);
    setCart((prev) => ({
      ...prev,
      [product.id]: { product, quantity },
    }));
  };

  const updateProductQuantity = async (productId: string, quantity: number) => {
    if (!user) return;
    await updateCartItem(user.id, productId, quantity);
    setCart((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], quantity },
    }));
  };

  const removeProductFromCart = async (productId: string) => {
    if (!user) return;
    await removeFromCart(user.id, productId);
    setCart((prev) => {
      const updatedCart = { ...prev };
      delete updatedCart[productId];
      return updatedCart;
    });
  };

  const deleteAllCart = async () => {
    if (!user) return;
    await deleteCart(user.id);
    setCart({});
  };

  return {
    cart,
    loading,
    addProductToCart,
    updateProductQuantity,
    removeProductFromCart,
    deleteAllCart,
  };
};

export default useCart;
