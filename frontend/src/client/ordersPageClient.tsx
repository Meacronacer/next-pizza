"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useUserOrders } from "@/hooks/useOrders";
import { IextrasOptions } from "@/@types/product";
import { Iorder } from "@/@types/order";

export default function OrdersPageClient() {
  const { data: orders, isLoading, error } = useUserOrders();

  if (isLoading) {
    return <div className="py-80 text-center">Loading orders...</div>;
  }

  if (error) {
    return (
      <div className="py-80 text-center text-red-600">Error loading orders</div>
    );
  }

  // Empty state: no orders yet
  if (!orders || orders.length === 0) {
    return (
      <div className="mx-auto my-[280px] p-4 md:p-8 text-center space-y-6">
        <p className="text-xl font-medium">You have no orders yet.</p>
        <Link href="/" passHref>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition">
            Return to Home
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 mt-16 space-y-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      {orders.map((order: Iorder, idx: number) => (
        <div
          key={order.id}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6"
        >
          {/* Order Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <div>
              <p className="text-lg font-semibold">
                Order #{orders.length - idx}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {format(new Date(order.created_at), "dd.MM.yyyy, HH:mm", {
                  locale: ru,
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">
                {order.final_total} $
              </p>
              <span
                className={
                  `inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ` +
                  (order.payment_type === "cash"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-blue-100 text-blue-800")
                }
              >
                {order.payment_type === "cash" ? "Cash" : "Card"}
              </span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p>
                <span className="font-medium">Customer:</span>{" "}
                {order.first_name} {order.second_name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {order.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {order.phone}
              </p>
            </div>
            <div>
              <p>
                <span className="font-medium">Address:</span> {order.address}
              </p>
              {order.comment && (
                <p>
                  <span className="font-medium">Comment:</span> {order.comment}
                </p>
              )}
            </div>
          </div>

          {/* Payment Details */}
          {order.payment_type === "card" && order.payment_details && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p>
                <span className="font-medium">Card Type:</span>{" "}
                {order.payment_details?.card_type}
              </p>
              <p>
                <span className="font-medium">Card Mask:</span>{" "}
                {order.payment_details?.card_mask}
              </p>
            </div>
          )}

          {/* Totals Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div>
              <span className="font-medium">Subtotal:</span>
              <span className="text-green-500"> {order.subtotal} $</span>
            </div>
            <div>
              <span className="font-medium">Tax (20%):</span>
              <span className="text-green-500"> {order.tax_amount} $</span>
            </div>
            <div>
              <span className="font-medium">Delivery:</span>
              <span className="text-green-500"> {order.delivery_fee} $</span>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row justify-between items-center bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden"
                >
                  <div className="flex items-center gap-4 p-4">
                    <Image
                      src={item.product_data.img_url}
                      alt={item.product_name}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {item.product_data.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col md:items-end p-4 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">x{item.quantity}</span>
                      <span className="font-semibold text-green-600">
                        {item.subtotal} $
                      </span>
                    </div>

                    {/* Extras */}
                    {item.extras.length > 0 && (
                      <div className="mt-2 w-full md:w-auto">
                        <p className="font-medium mb-1">Extras:</p>
                        <div className="flex flex-wrap gap-4">
                          {item.extras.map((extra: IextrasOptions) => (
                            <div
                              key={extra.id}
                              className="flex items-center gap-2"
                            >
                              <Image
                                src={extra.img_url || ""}
                                alt={extra.name}
                                width={24}
                                height={24}
                                className="rounded-full"
                              />
                              <span className="text-sm">{extra.name}</span>
                              <span className="text-green-500 text-sm">
                                {extra.price} $
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
