import { OrderPayload, IpaymentVerify } from "@/@types/order";
import { API_URL } from "./base";

export async function fetchUserOrders() {
  const response = await fetch(`${API_URL}/api/orders/my-orders/`, {
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

export async function verifyPayment({ orderId, token }: IpaymentVerify) {
  const res = await fetch(`${API_URL}/api/orders/${orderId}?token=${token}`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`Order verification failed: ${res.statusText}`);
  }

  return res.json();
}
