import { useCart, useUpdateCartItemQuantity } from "@/hooks/useCart";
import React, { useEffect, useRef, useState } from "react";
import ProductModal from "./productModal";
import { LinkTo } from "@/utils/navigations";
import { useRouter } from "next/navigation";
import { enableScroll } from "@/utils/scrollbar";

interface CartItem {
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

interface CartPanelProps {
  open: boolean;
  onClose: () => void;
  cartItems: CartItem[];
}

const CartPanel: React.FC<CartPanelProps> = ({ open, onClose, cartItems }) => {
  // Функция для расчета общей стоимости позиции
  const [editProduct, setEditProduct] = useState<any>({});
  const [showModal, setShowModal] = useState<boolean>(false);
  const router = useRouter();

  const calculateItemTotal = (item: CartItem) => {
    const basePrice = item.price;
    const extrasTotal = item.extras.reduce(
      (sum, extra) => sum + extra.price,
      0
    );
    return (basePrice + extrasTotal) * item.quantity;
  };

  const { mutate: updateCartItemQuantity, isPending } =
    useUpdateCartItemQuantity();

  const increaseProductQuantityHandler = (
    quantity: number,
    item_key: string
  ) => {
    updateCartItemQuantity({
      quantity: quantity + 1,
      item_key,
    });
  };

  const decreaseProductQuantityHandler = (
    quantity: number,
    item_key: string
  ) => {
    updateCartItemQuantity({
      quantity: quantity - 1,
      item_key,
    });
  };

  return (
    <div
      className={`fixed inset-0 h-dvh z-50 ${open ? "visible" : "invisible"}`}
    >
      {/* Overlay */}
      <div
        className={`fixed inset-0 h-dvh bg-black transition-all ${
          open ? "opacity-50" : "opacity-0"
        }`}
        onClick={isPending ? undefined : onClose} // Блокируем закрытие при загрузке
      />

      {/* Панель корзины */}
      <div
        className={`fixed right-0 top-0 h-dvh w-80 dark:bg-gray-800 bg-white shadow-xl transform transition-all duration-300 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {isPending && (
          <div className="absolute inset-0 bg-black opacity-50 w-full h-dvh z-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
          </div>
        )}

        {/* Заголовок */}
        <div
          className={`p-4 border-b flex-shrink-0 ${
            isPending ? "opacity-50" : ""
          }`}
        >
          <h2 className="text-lg font-bold">Корзина</h2>
        </div>

        {/* Список товаров с прокруткой */}
        <div
          className={`flex-1 overflow-y-auto px-4 ${
            isPending ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          {cartItems.length === 0 ? (
            <p className="text-gray-500 py-4">Ваша корзина пуста</p>
          ) : (
            cartItems.map((item, index) => {
              const basePrice = item.price;
              const extrasTotal = item.extras.reduce(
                (sum, extra) => sum + extra.price,
                0
              );
              const pricePerUnit = basePrice + extrasTotal;

              return (
                <div key={item.key} className="py-4 border-b last:border-b-0">
                  <div className="flex justify-between items-start">
                    {/* Левая часть: изображение и информация */}
                    <div className="flex gap-3">
                      <img
                        src={item.img_url}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex flex-col">
                        <h3 className="font-medium">{item.name}</h3>

                        {/* Базовая цена */}
                        <div className="text-gray-500 text-xs mt-1">
                          Основная цена: <br />{" "}
                          <span className="text-green-600">
                            {basePrice.toFixed(2)} $
                          </span>
                        </div>

                        {/* Экстра-опции */}
                        {item.extras.length > 0 && (
                          <div className="text-xs text-gray-500">
                            Дополнительно:
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

                        {/* Итоговая цена за единицу */}
                        <div className="text-xs text-green-400 mt-1">
                          Цена за ед.: {pricePerUnit.toFixed(2)} $
                        </div>

                        {/* Общая сумма за позицию */}
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                          Итого: {(pricePerUnit * item.quantity).toFixed(2)} $
                        </p>
                      </div>
                    </div>

                    {/* Правая часть: управление */}
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => {
                          setEditProduct(item);
                          setShowModal(true);
                        }}
                        className="text-blue-500 cursor-pointer hover:underline text-sm"
                      >
                        Изменить
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          disabled={isPending}
                          onClick={() =>
                            decreaseProductQuantityHandler(
                              item.quantity,
                              item.key
                            )
                          }
                          className="w-6 h-6 pb-1 flex items-center justify-center rounded bg-orange-500 cursor-pointer hover:bg-orange-700 duration-200"
                        >
                          -
                        </button>

                        <span>{item.quantity}</span>
                        <button
                          disabled={isPending}
                          onClick={() =>
                            increaseProductQuantityHandler(
                              item.quantity,
                              item.key
                            )
                          }
                          className="w-6 h-6 rounded bg-orange-500 cursor-pointer hover:bg-orange-700 duration-200"
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

        {/* Фиксированный футер */}
        <div
          className={`p-4 border-t flex-shrink-0 bg-white dark:bg-gray-800 ${
            isPending ? "opacity-50" : ""
          }`}
        >
          <div className="mb-4 flex justify-between font-medium">
            <span>Итого:</span>
            <span>
              {cartItems
                .reduce((acc, item) => acc + calculateItemTotal(item), 0)
                .toFixed(2)}{" "}
              $
            </span>
          </div>
          <button
            onClick={() => {
              onClose();
              router.push(LinkTo.checkout);
            }}
            className="w-full cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-colors"
          >
            Оформить заказ
          </button>
        </div>
      </div>
      <ProductModal
        changeMode={true}
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
