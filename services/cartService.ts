import { API_ROUTES } from "@/constants/api_routes.enum";
import { database as db } from "@/firebase/client";
import { CartItem } from "@/types/cart.interface";
import { Product } from "@/types/product.interface";
import { ref, set, update, remove, get } from "firebase/database";

export const addToCart = async (
  userId: string,
  productId: string,
  quantity: number,
  product: Product
) => {
  const cartRef = ref(db, `${API_ROUTES.CARTS}/${userId}/${productId}`);
  await set(cartRef, { quantity, product });
};

export const updateCartItem = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  const cartRef = ref(db, `${API_ROUTES.CARTS}/${userId}/${productId}`);
  await update(cartRef, { quantity });
};

export const removeFromCart = async (userId: string, productId: string) => {
  const cartRef = ref(db, `${API_ROUTES.CARTS}/${userId}/${productId}`);
  await remove(cartRef);
};

export const fetchCart = async (
  userId: string
): Promise<Record<string, CartItem> | null> => {
  const cartRef = ref(db, `${API_ROUTES.CARTS}/${userId}`);
  const snapshot = await get(cartRef);
  return snapshot.exists()
    ? (snapshot.val() as Record<string, CartItem>)
    : null;
};

export const deleteCart = async (userId: string) => {
  const cartRef = ref(db, `${API_ROUTES.CARTS}/${userId}`);
  await remove(cartRef);
};
