import { IcartItem } from "@/@types/cart";
import { useCart, useUpdateCartItemQuantity } from "./useCart";

const TAX_RATE = 0.2;
const DELIVERY_FEE = 5;

export function useCartSummary() {
  const { data: items = [], isLoading, error } = useCart();
  const { mutate: updateQty, isPending } = useUpdateCartItemQuantity();

  const calcItemTotal = (item: IcartItem) =>
    (item.price + item.extras.reduce((sum, e) => sum + e.price, 0)) *
    item.quantity;

  const subtotal = items.reduce((acc, i) => acc + calcItemTotal(i), 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + DELIVERY_FEE;

  const changeQuantity = (key: string, qty: number) => {
    updateQty({ item_key: key, quantity: qty });
  };

  return {
    items,
    isLoading,
    error,
    isUpdating: isPending,
    calcItemTotal,
    subtotal,
    tax,
    total,
    changeQuantity,
    deliveryFee: DELIVERY_FEE,
  };
}
