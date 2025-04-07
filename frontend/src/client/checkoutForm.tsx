import { Button } from "@/components/ui/button";
import React from "react";

const CheckoutForm: React.FC = () => {
  return (
    <div className="container mx-auto p-4 mb-20">
      <h1 className="text-center text-3xl font-bold mb-10">Checkout</h1>
      {/* На десктопе используем flex-row, на мобильных — flex-col */}
      <form className="flex flex-col md:flex-row gap-10">
        {/* Левая колонка */}
        <div className="flex-1 flex flex-col gap-10">
          {/* 1. Cart Section */}
          <section className="rounded-[30px] p-8 bg-gray-100 dark:bg-gray-800 max-w-3xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold">1. Cart</h2>
              <button
                type="button"
                className="flex items-center gap-x-1 text-sm font-medium hover:opacity-70"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-.867 12.142A2 2 0 0 1 16.138 20H7.862a2 2 0 0 1-1.995-1.858L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                </svg>
                Clear cart
              </button>
            </div>
            <hr className="mb-5 border-gray-300" />
            {/* Пример списка товаров */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-4">
                <div className="flex items-center gap-x-4">
                  <img
                    src="/placeholder.jpg"
                    alt="Product"
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">Product Name</p>
                    <p className="text-sm">$20.00</p>
                  </div>
                </div>
                <div className="flex items-center gap-x-2">
                  <button
                    type="button"
                    className="px-2 py-1 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span>1</span>
                  <button
                    type="button"
                    className="px-2 py-1 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
              {/* Дополнительные товары можно добавить аналогичным образом */}
            </div>
          </section>

          {/* 2. Personal Info Section */}
          <section className="rounded-[30px] p-8 bg-gray-100 dark:bg-gray-800 max-w-3xl">
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

          {/* 3. Delivery Address Section */}
          <section className="rounded-[30px] p-8 bg-gray-100 dark:bg-gray-800 max-w-3xl">
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
          <div className="sticky  top-[113px] flex flex-col gap-10">
            {/* 4. Payment Section (расположена в правой колонке сверху) */}
            <section className="rounded-[30px] p-8 bg-gray-100 dark:bg-gray-800">
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

            {/* 5. Order Summary Section */}
            <section className="rounded-[30px] p-8 bg-gray-100 dark:bg-gray-800">
              <h2 className="text-2xl font-bold mb-5">Order Summary</h2>
              <hr className="mb-5 border-gray-300" />
              <div className="flex flex-col gap-4">
                <div className="flex justify-between">
                  <span className="text-lg">Total Value</span>
                  <span className="font-bold">$20.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-lg">Taxes</span>
                  <span className="font-bold">$3.80</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-lg">Delivery</span>
                  <span className="font-bold">$5.00</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>$28.80</span>
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
