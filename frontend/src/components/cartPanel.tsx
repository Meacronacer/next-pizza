import { useUpdateCartItemQuantity } from "@/hooks/useCart";
import React, { useState } from "react";
import ProductModal from "./productModal";
import { LinkTo } from "@/utils/navigations";
import { useRouter } from "next/navigation";
import { IcartItem } from "@/@types/cart";

interface CartPanelProps {
  open: boolean;
  onClose: () => void;
  cartItems: IcartItem[];
}

const CartPanel: React.FC<CartPanelProps> = ({ open, onClose, cartItems }) => {
  const router = useRouter();
  const [editProduct, setEditProduct] = useState<any>({});
  const [showModal, setShowModal] = useState(false);
  const { mutate: updateCartItemQuantity, isPending } =
    useUpdateCartItemQuantity();

  const SHIPPING_FEE = 5;
  const TAX_RATE = 0.2;

  const calculateItemTotal = (item: IcartItem) => {
    const basePrice = item.price;
    const extrasTotal = item.extras.reduce(
      (sum, extra) => sum + extra.price,
      0
    );
    return (basePrice + extrasTotal) * item.quantity;
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + calculateItemTotal(item),
    0
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + SHIPPING_FEE;

  return (
    <div
      className={`fixed inset-0 h-dvh z-50 ${open ? "visible" : "invisible"}`}
    >
      <div
        className={`fixed inset-0 h-dvh bg-black transition-all ${
          open ? "opacity-50" : "opacity-0"
        }
        `}
        onClick={isPending ? undefined : onClose}
      />
      <div
        className={`fixed right-0 top-0 h-dvh w-80 dark:bg-gray-800 bg-white shadow-xl transform transition-all duration-300 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }
        `}
      >
        {isPending && (
          <div className="absolute inset-0 bg-black opacity-50 w-full h-dvh z-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
          </div>
        )}
        <div
          className={`p-4 border-b flex-shrink-0 ${
            isPending ? "opacity-50" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Cart</h2>
            <button
              onClick={isPending ? undefined : onClose}
              className="cursor-pointer px-2 duration-200 text-2xl hover:bg-black/50 rounded-full"
            >
              x
            </button>
          </div>
        </div>
        <div
          className={`flex-1 overflow-y-auto px-4 ${
            isPending ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          {cartItems.length === 0 ? (
            <p className="text-gray-500 py-4 text-center">Ваша корзина пуста</p>
          ) : (
            cartItems.map((item) => {
              const basePrice = item.price;
              const extrasTotal = item.extras.reduce(
                (sum, e) => sum + e.price,
                0
              );
              const pricePerUnit = basePrice + extrasTotal;
              return (
                <div key={item.key} className="py-4 border-b last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <img
                        src={item.img_url}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex flex-col">
                        <h3 className="font-medium">{item.name}</h3>
                        <div className="text-gray-500 text-xs mt-1">
                          Basic price:{" "}
                          <span className="text-green-600">
                            {basePrice.toFixed(2)} $
                          </span>
                        </div>
                        {item.extras.length > 0 && (
                          <div className="text-xs text-gray-500">
                            Additionally:
                            {item.extras.map((extra) => (
                              <div key={extra.name} className="ml-1">
                                + {extra.name} (
                                <span className="text-green-600">
                                  {extra.price.toFixed(2)} $
                                </span>
                                )
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="text-xs text-green-500 mt-1">
                          Price per unit: {pricePerUnit.toFixed(2)} $
                        </div>
                        <p className="text-sm text-green-400 underline mt-1">
                          Total: {(pricePerUnit * item.quantity).toFixed(2)} $
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => {
                          setEditProduct(item);
                          setShowModal(true);
                        }}
                        className="text-blue-500 cursor-pointer hover:underline text-sm"
                      >
                        Change
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          disabled={isPending}
                          onClick={() =>
                            updateCartItemQuantity({
                              item_key: item.key,
                              quantity: item.quantity - 1,
                            })
                          }
                          className="w-6 h-6 pb-1 flex cursor-pointer items-center justify-center rounded bg-orange-500 hover:bg-orange-700 transition"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          disabled={isPending}
                          onClick={() =>
                            updateCartItemQuantity({
                              item_key: item.key,
                              quantity: item.quantity + 1,
                            })
                          }
                          className="w-6 h-6 rounded cursor-pointer bg-orange-500 hover:bg-orange-700 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {cartItems.length > 0 && (
          <div
            className={`p-4 border-t bg-white dark:bg-gray-800 flex-shrink-0 ${
              isPending ? "opacity-50" : ""
            }`}
          >
            {/* Подытог */}
            <div className="mb-2 w-full text-sm">
              <div className="flex items-center justify-between">
                <span className="text-nowrap">Sub total</span>
                <span className="flex‑1 pt-2 border-b border-dotted w-full mx-1" />
                <span className=" text-nowrap text-green-400">
                  {subtotal.toFixed(2)} $
                </span>
              </div>
            </div>

            {/* Налог */}
            <div className="mb-2 text-sm">
              <div className="flex items-center">
                <span className="text-nowrap">Taxes (20%)</span>
                <span className="flex‑1 pt-2 border-b border-dotted  w-full mx-1" />
                <span className=" text-nowrap text-green-500">
                  {tax.toFixed(2)} $
                </span>
              </div>
            </div>

            {/* Доставка */}
            <div className="mb-4 text-sm">
              <div className="flex items-center">
                <span>Delivery</span>
                <span className="flex‑1 pt-2 border-b border-dotted w-full mx-1" />
                <span className=" text-nowrap text-green-600">
                  {SHIPPING_FEE.toFixed(2)} $
                </span>
              </div>
            </div>

            {/* Итого */}
            <div className="mb-4 text-lg font-bold">
              <div className="flex items-center">
                <span>Total</span>
                <span className="flex‑1 pt-2 border-b border-dotted w-full mx-1" />
                <span className="text-green-400 text-nowrap">
                  {total.toFixed(2)} $
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                router.push(LinkTo.checkout);
              }}
              className="w-full bg-orange-500 cursor-pointer hover:bg-orange-600 text-white py-3 rounded-lg transition-colors"
            >
              Оформить заказ
            </button>
          </div>
        )}
      </div>
      <ProductModal
        changeMode
        product={editProduct}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        extras={editProduct.extras}
        variant_id={editProduct.variant_id}
      />
    </div>
  );
};

export default CartPanel;
