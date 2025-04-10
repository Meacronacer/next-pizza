"use client";
import { Button } from "@/components/ui/button";
import { useCart, useUpdateCartItemQuantity } from "@/hooks/useCart";
import React from "react";

// В начале файла добавьте интерфейс CartItem если его нет
interface CartItem {
  key: string;
  product_id: string;
  variant_id: string;
  name: string;
  img_url: string;
  price: number;
  quantity: number;
  extras: Array<{
    name: string;
    price: number;
  }>;
}

// Затем обновите компонент CheckoutForm
const CheckoutForm: React.FC = () => {
  const { data, isLoading, error } = useCart();
  const { mutate: updateCartItemQuantity } = useUpdateCartItemQuantity();

  // Функция для расчета общей стоимости позиции
  const calculateItemTotal = (item: CartItem) => {
    const basePrice = item.price;
    const extrasTotal = item.extras.reduce(
      (sum, extra) => sum + extra.price,
      0
    );
    return (basePrice + extrasTotal) * item.quantity;
  };

  // Функции для изменения количества
  const handleQuantityChange = (itemKey: string, newQuantity: number) => {
    updateCartItemQuantity({
      quantity: newQuantity,
      item_key: itemKey,
    });
  };

  if (isLoading) return <div>Загрузка данных корзины...</div>;
  if (error) return <div>Ошибка при загрузке корзины</div>;

  // Расчет итоговых сумм
  const totalValue = data?.reduce(
    (acc, item) => acc + calculateItemTotal(item),
    0
  );
  const taxes = totalValue ? totalValue * 0.05 : 0; // Пример налога 5%
  const delivery = 5.0; // Фиксированная стоимость доставки
  const total = totalValue ? totalValue + taxes + delivery : 0;

  return (
    <div className="container mx-auto p-4 mt-10 mb-20">
      <h1 className="text-center text-3xl font-bold mb-10">Checkout</h1>
      <form className="flex flex-col md:flex-row gap-10">
        {/* Левая колонка */}
        <div className="flex-1 flex flex-col gap-10">
          {/* 1. Cart Section */}
          <section className="rounded-[30px] p-8 bg-gray-100 dark:bg-gray-800 max-w-3xl shadow-xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold">1. Cart</h2>
              <button
                type="button"
                className="flex items-center gap-x-1 text-sm font-medium hover:opacity-70"
              >
                {/* Кнопка очистки корзины */}
              </button>
            </div>
            <hr className="mb-5 border-gray-300" />

            {/* Список товаров */}
            <div className="space-y-6">
              {data?.map((item) => {
                const pricePerUnit =
                  item.price +
                  item.extras.reduce((sum, extra) => sum + extra.price, 0);

                return (
                  <div key={item.key} className="border-b pb-6 last:border-b-0">
                    <div className="flex justify-between items-start gap-4">
                      {/* Левая часть: изображение и информация */}
                      <div className="flex gap-4">
                        <img
                          src={item.img_url}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex flex-col">
                          <h3 className="font-medium text-lg">{item.name}</h3>

                          {/* Информация о цене */}
                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <div>Базовая цена: {item.price.toFixed(2)} $</div>
                            {item.extras.length > 0 && (
                              <div className="mt-1">
                                Дополнительно:
                                {item.extras.map((extra) => (
                                  <div key={extra.name} className="ml-2">
                                    + {extra.name} ({extra.price.toFixed(2)} $)
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Цена за единицу */}
                          <div className="mt-2 text-sm text-green-600">
                            Цена за ед.: {pricePerUnit.toFixed(2)} $
                          </div>
                        </div>
                      </div>

                      {/* Правая часть: количество и общая сумма */}
                      <div className="flex flex-col items-end gap-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(item.key, item.quantity - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                          >
                            -
                          </button>
                          <span className="min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(item.key, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-lg font-semibold">
                          {(pricePerUnit * item.quantity).toFixed(2)} $
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
          <section className="rounded-[30px] p-8 bg-gray-100 dark:bg-gray-800 max-w-3xl shadow-xl">
            <h2 className="text-2xl font-bold mb-5">2. Personal Info</h2>
            <hr className="mb-5 border-gray-300" />
            <div className="grid grid-cols-2 gap-6 tablet:grid-cols-1">
              <div className="flex flex-col">
                <label className="font-bold mb-1">First Name</label>
                <input
                  type="text"
                  placeholder="Enter first name"
                  className="border rounded p-2 bg-transparent"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-bold mb-1">Last Name</label>
                <input
                  type="text"
                  placeholder="Enter last name"
                  className="border rounded p-2 bg-transparent"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-bold mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  className="border rounded p-2 bg-transparent"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-bold mb-1">Phone</label>
                <input
                  type="tel"
                  placeholder="Enter phone"
                  className="border rounded p-2 bg-transparent"
                />
              </div>
            </div>
          </section>

          <section className="rounded-[30px] p-8 bg-gray-100 dark:bg-gray-800 max-w-3xl shadow-xl">
            <h2 className="text-2xl font-bold mb-5">3. Delivery Address</h2>
            <hr className="mb-5 border-gray-300" />
            <div className="flex flex-col gap-4">
              <label className="font-bold">Address</label>
              <input
                type="text"
                placeholder="Enter delivery address"
                className="border rounded p-2 bg-transparent"
              />
              <label className="font-bold">Comment</label>
              <textarea
                placeholder="Additional instructions"
                className="border rounded p-2 resize-none bg-transparent"
                rows={3}
              ></textarea>
            </div>
          </section>
        </div>

        {/* Правая колонка */}
        <div className="w-full md:w-1/3">
          <div className="top-[130px] flex flex-col gap-10">
            {/* 4. Payment Section (расположена в правой колонке сверху) */}
            <section className="rounded-[30px] p-8 bg-gray-100 dark:bg-gray-800 shadow-xl">
              <h2 className="text-2xl font-bold mb-5">4. Payment</h2>
              <hr className="mb-5 border-gray-300" />
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-x-2">
                  <input
                    type="radio"
                    id="cash"
                    name="paymentType"
                    value="cash"
                    defaultChecked
                  />
                  <label htmlFor="cash" className="cursor-pointer">
                    Cash on delivery
                  </label>
                </div>
                <div className="flex items-center gap-x-2">
                  <input
                    type="radio"
                    id="card"
                    name="paymentType"
                    value="card"
                  />
                  <label htmlFor="card" className="cursor-pointer">
                    Credit Card
                  </label>
                </div>
              </div>
            </section>

            {/* Order Summary Section */}
            <section className="rounded-[30px] p-8 bg-gray-100 dark:bg-gray-800 shadow-xl">
              <h2 className="text-2xl font-bold mb-5">Order Summary</h2>
              <hr className="mb-5 border-gray-300" />
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 w-full">
                  <span className="text-lg">Total Value</span>
                  <div className="flex-1 border-b-2 border-dotted border-gray-400 dark:border-gray-600 h-1" />
                  <span className="font-bold text-green-500">
                    {totalValue?.toFixed(2)} $
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full">
                  <span className="text-lg">Taxes</span>
                  <div className="flex-1 border-b-2 border-dotted border-gray-400 dark:border-gray-600 h-1" />
                  <span className="font-bold text-green-600">
                    {taxes.toFixed(2)} $
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full">
                  <span className="text-lg">Delivery</span>
                  <div className="flex-1 border-b-2 border-dotted border-gray-400 dark:border-gray-600 h-1" />
                  <span className="font-bold text-green-600">
                    {delivery.toFixed(2)} $
                  </span>
                </div>

                <div className="border-t pt-4 flex items-center gap-2 w-full text-xl font-bold">
                  <span>Total</span>
                  <div className="flex-1 border-b-2 border-dotted border-gray-400 dark:border-gray-600 h-1" />
                  <span className="text-green-400">{total.toFixed(2)} $</span>
                </div>
              </div>
              <Button type="submit" className="mt-6 w-full">
                Place Order
              </Button>
            </section>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
