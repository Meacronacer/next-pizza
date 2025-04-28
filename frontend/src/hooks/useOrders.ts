import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOrder,
  fetchUserOrders,
  liqpayInit,
  verifyPayment,
} from "@/api/ordersApi";
import { OrderPayload } from "@/@types/order";

export const useUserOrders = () => {
  return useQuery({
    queryKey: ["userOrders"],
    queryFn: fetchUserOrders,
  });
};

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: OrderPayload) => createOrder(payload),
    onSuccess: () => {
      // Если необходимо, можно очистить корзину или обновить другие запросы
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export const useLiqpayInit = () => {
  return useMutation({
    mutationFn: (orderId: string) => liqpayInit(orderId),
  });
};

export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (token: string) => verifyPayment(token),
    onSuccess: () => {
      // Если необходимо, можно очистить корзину или обновить другие запросы
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
