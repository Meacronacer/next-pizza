"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useVerifyPayment } from "@/hooks/useOrders";
import { OrderDetails } from "@/@types/order";

export default function PaymentSuccessPageClient() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { mutate: verifyPayment } = useVerifyPayment();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const token = searchParams.get("token");
      try {
        if (!token) {
          throw new Error("Invalid payment confirmation");
        }

        verifyPayment(token, { onSuccess: (data) => setOrder(data) });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [searchParams, verifyPayment]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 ">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold mb-4">Payment Verification Failed</h1>
        <p className="text-gray-600 mb-8">
          {error || "Unable to verify your payment. Please contact support."}
        </p>
        <Link
          href="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Return to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen my-20 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto mb-6 w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center transition-colors">
            <svg
              className="w-12 h-12 text-green-600 dark:text-green-300 animate-check"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Payment Successful! 🎉
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Thank you for your order #{order.order_id}.
          </p>
        </div>

        {/* Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-700/30 p-6 sm:p-8 mb-12 transition-colors">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Order Summary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Left */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Paid
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  ${order.amount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Taxes
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  ${order.tax_amount.toFixed(2)}
                </p>
              </div>
            </div>
            {/* Right */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Delivery Fee
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  ${order.delivery_fee.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Payment Date
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {order.payment_date
                    ? new Date(order.payment_date).toLocaleString()
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Items in Your Order
          </h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow dark:shadow-gray-700/30 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {item?.img_url ? (
                    <Image
                      src={item?.img_url}
                      alt={item.product_name}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-md" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {item.product_name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  ${parseFloat(item.subtotal).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Continue */}
        <div className="text-center">
          <Link
            href="/"
            className="bg-blue-600 dark:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
          >
            Continue Shopping →
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes check {
          from {
            stroke-dashoffset: 26;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-check {
          animation: check 0.6s ease-in-out forwards;
          stroke-dasharray: 26;
          stroke-dashoffset: 26;
        }
      `}</style>
    </div>
  );
}
