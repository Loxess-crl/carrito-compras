import { API_ROUTES } from "@/constants/api_routes.enum";
import { API_URL } from "@/constants/constants";
import { Product } from "@/types/product.interface";

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_URL}/${API_ROUTES.PRODUCTS}`);
  if (!response.ok) {
    throw new Error("Error al obtener los productos");
  }
  return response.json();
};

export const fetchProductById = async (productId: string): Promise<Product> => {
  const response = await fetch(
    `${API_URL}/${API_ROUTES.PRODUCTS}?id=${productId}`
  );
  if (!response.ok) {
    throw new Error("Error al obtener los productos");
  }
  const data = await (response.json() as Promise<Product[]>);

  return data[0];
};
