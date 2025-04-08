import { useCart } from "@/hooks/useCart";
import useClickOutside from "@/hooks/useClickOutside";
import React, { useEffect, useRef } from "react";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartPanelProps {
  open: boolean;
  onClose: () => void;
  cartItems: CartItem[];
}

const CartPanel: React.FC<CartPanelProps> = ({ open, onClose, cartItems }) => {
  const { data, isLoading, error } = useCart();

  return (
    <div
      className={`fixed inset-0 h-dvh z-50 ${open ? "visible" : "invisible"}`}
    >
      {/* Overlay */}
      <div
        className={`fixed inset-0 h-dvh bg-black transition-all ${
          open ? "opacity-50" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Панель корзины */}
      <div
        className={`fixed right-0 top-0 h-dvh w-80 bg-white shadow-xl transform transition-all duration-300 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Заголовок */}
        <div className="p-4 border-b flex-shrink-0">
          <h2 className="text-lg text-black font-bold">Корзина</h2>
        </div>

        {/* Список товаров с прокруткой */}
        <div className="flex-1 overflow-y-auto px-4">
          {cartItems.length === 0 ? (
            <p className="text-gray-500 py-4">Ваша корзина пуста</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-4 border-b"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.price.toFixed(2)}$
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-2 py-1 bg-gray-200 rounded">-</button>
                  <span>{item.quantity}</span>
                  <button className="px-2 py-1 bg-gray-200 rounded">+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Фиксированный футер */}
        <div className="p-4 border-t flex-shrink-0 bg-white">
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-colors">
            Оформить заказ
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPanel;
