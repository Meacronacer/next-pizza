import { OrderPayload, IpaymentVerify } from "@/@types/order";
import { API_URL, customFetch } from "./base";

export async function fetchUserOrders() {
  const response = await customFetch(`${API_URL}/api/orders/my-orders/`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Ошибка при загрузке заказов");
  return response.json();
}

export async function createOrder(payload: OrderPayload) {
  const res = await fetch(`${API_URL}/api/orders/create/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Order creation failed");
  }

  return res.json();
}

export async function liqpayInit(orderId: string) {
  const res = await fetch(`${API_URL}/api/orders/liqpay-init/${orderId}/`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Liqpay init failed");
  }

  return res.json();
}

export async function verifyPayment({ orderId, token }: IpaymentVerify) {
  const res = await fetch(`${API_URL}/api/orders/verify/${token}/`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Payment verification failed");
  }

  return res.json();
}
