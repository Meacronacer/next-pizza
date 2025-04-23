import {
  IcartItem,
  IeditCartItem,
  IupdateCartItemQuantity,
} from "@/@types/cart";
import { API_URL } from "./base";
import { ImessageResponse } from "@/@types/auth";

export async function fetchCart(): Promise<IcartItem[]> {
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
  payload: IupdateCartItemQuantity
): Promise<ImessageResponse> {
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

export async function editCartItem(
  payload: IeditCartItem
): Promise<ImessageResponse> {
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
