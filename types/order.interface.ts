import { CartItem } from "./cart.interface";
import { Product } from "./product.interface";
import { User } from "./user.interface";

export interface Order {
  id: string;
  user: User;
  cart: CartItem[];
  total: number;
  state: OrderState;
}
/* Pendiente, Confirmado, En camino, Entregado */
export type OrderState = "P" | "C" | "E" | "Eo";
