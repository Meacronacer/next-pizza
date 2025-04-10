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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

// api/cartApi.js
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

export async function removeCartItem(
  payload: Pick<CartItem, "product_variant_id">
): Promise<any> {
  const res = await fetch(API_URL + "/api/cart/remove/", {
    method: "POST", // либо DELETE, в зависимости от реализации
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("Error removing cart item");
  }
  return res.json();
}
