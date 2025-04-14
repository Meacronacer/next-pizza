import { API_URL } from "./base";

// api/cart.ts
export interface CartItem {
  product_variant_id: number;
  product_name: string;
  subtotal: number;
  key: string;
  product_id: string;
  variant_id: string;
  name: string;
  img_url: string;
  price: number; // Цена варианта продукта
  quantity: number;
  extras: Array<{
    name: string;
    price: number;
  }>;
}

export interface AddToCartPayload {
  variant_id: number;
  quantity: number;
}

export interface UpdateCartPayload {
  item_key: string;
  quantity: number;
}

export interface RemoveCartPayload {
  product_variant_id: number;
}

export async function fetchCart(): Promise<CartItem[]> {
  const res = await fetch(API_URL + "/api/cart/", {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Error fetching cart");
  }
  return res.json();
}

export async function addToCart(itemData: any) {
  const response = await fetch(API_URL + "/api/cart/add/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // передаём cookie с сессией
    body: JSON.stringify(itemData),
  });
  if (!response.ok) {
    throw new Error("Ошибка при добавлении в корзину");
  }
  const data = await response.json();
  return data.cart;
}

export async function updateCartItemQuantity(
  payload: UpdateCartPayload
): Promise<any> {
  const res = await fetch(API_URL + "/api/cart/update/", {
    method: "POST", // либо PATCH, если это настроено
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("Error updating cart item");
  }
  return res.json();
}

export async function editCartItem(payload: UpdateCartPayload): Promise<any> {
  const res = await fetch(API_URL + "/api/cart/edit/", {
    method: "POST", // либо PATCH, если это настроено
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("Error updating cart item");
  }
  return res.json();
}

export async function clearCart() {
  const res = await fetch(API_URL + "/api/cart/clear/", {
    method: "POST", // либо DELETE, в зависимости от реализации
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Error removing cart item");
  }
  return res.json();
}
