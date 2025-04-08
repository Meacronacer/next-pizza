// api/cart.ts
export interface CartItem {
  product_variant_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface AddToCartPayload {
  product_variant_id: number;
  quantity: number;
}

export interface UpdateCartPayload {
  product_variant_id: number;
  quantity: number;
}

export interface RemoveCartPayload {
  product_variant_id: number;
}

export interface CartResponse {
  cart: CartItem[];
}

export async function fetchCart(): Promise<CartResponse> {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/cart/", {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Error fetching cart");
  }
  return res.json();
}

export async function addToCart(
  payload: Pick<CartItem, "product_variant_id" | "quantity">
): Promise<any> {
  const res = await fetch("/api/cart/add/", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("Error adding to cart");
  }
  return res.json();
}

export async function updateCartItem(
  payload: Pick<CartItem, "product_variant_id" | "quantity">
): Promise<any> {
  const res = await fetch("/api/cart/update/", {
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
  const res = await fetch("/api/cart/remove/", {
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
