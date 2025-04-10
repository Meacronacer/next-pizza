import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchCart,
  addToCart,
  removeCartItem,
  AddToCartPayload,
  UpdateCartPayload,
  RemoveCartPayload,
  CartItem,
  updateCartItemQuantity,
  editCartItem,
} from "../api/cartApi";

export function useCart() {
  return useQuery<CartItem[], Error>({
    queryKey: ["cart"],
    queryFn: fetchCart,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddToCartPayload) => addToCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useUpdateCartItemQuantity() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, UpdateCartPayload, unknown>({
    mutationFn: updateCartItemQuantity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useEditCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => editCartItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RemoveCartPayload) => removeCartItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
