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
  const panelRef = useRef<HTMLDivElement>(null);

  // Обработка клика вне панели для закрытия корзины
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 h-dvh transition-all duration-300 ${
        open ? "visible" : "invisible"
      }`}
    >
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black h-dvh opacity-50 transition-transform duration-300  ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={onClose}
      ></div>
      {/* Боковая панель корзины */}
      <div
        ref={panelRef}
        className={`absolute right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Заголовок */}
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Корзина</h2>
        </div>
        {/* Список товаров */}
        <div className="p-4 overflow-y-auto h-full">
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Ваша корзина пуста</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2 border-b"
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
                {/* Кнопки для изменения количества */}
                <div className="flex items-center space-x-2">
                  <button className="px-2 py-1 bg-gray-200 rounded">-</button>
                  <span>{item.quantity}</span>
                  <button className="px-2 py-1 bg-gray-200 rounded">+</button>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Футер с кнопкой оформления заказа */}
        <div className="p-4 border-t">
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">
            Оформить заказ
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPanel;
