"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { LinkTo } from "@/utils/navigations";
import { useUserProfile } from "@/hooks/useAuth";

interface Order {
  id: string;
  date: string;
  status: "pending" | "delivering" | "completed";
  paymentMethod: "cash" | "card";
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    extras: string[];
  }>;
}

export default function ProfilePage() {
  const { data: user, isLoading, error } = useUserProfile();
  const router = useRouter();

  // Временные данные заказов
  const orders: Order[] = [
    {
      id: "001234",
      date: "2024-03-15T14:30:00",
      status: "completed",
      paymentMethod: "cash",
      total: 25.0,
      items: [
        {
          name: "Пицца Маргарита",
          quantity: 1,
          price: 20.0,
          extras: ["Дополнительный сыр"],
        },
      ],
    },
    {
      id: "001235",
      date: "2024-03-16T18:45:00",
      status: "delivering",
      paymentMethod: "card",
      total: 34.5,
      items: [
        {
          name: "Паста Карбонара",
          quantity: 2,
          price: 15.0,
          extras: [],
        },
      ],
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile</div>;

  return (
    <div className="container mx-auto p-4 md:p-8 mt-20">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-[30px] p-6">
        {/* Информация о пользователе */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src="/default-avatar.png"
            alt="Avatar"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold">
              {user?.first_name} {user?.last_name}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {user?.email}
            </p>
          </div>
          <Button className="ml-auto bg-orange-500 hover:bg-orange-700 text-white">
            Выйти
          </Button>
        </div>
        <hr className="my-6 border-gray-300" />

        {/* Раздел с последними заказами */}
        <h2 className="text-xl font-bold mb-4">Последние заказы</h2>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg p-4 bg-gray-100 dark:bg-gray-700 shadow-md"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Заказ #{order.id}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {format(new Date(order.date), "dd.MM.yyyy, HH:mm", {
                      locale: ru,
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-400">
                    {order.total.toFixed(2)} $
                  </p>
                  <p
                    className={`${
                      order.paymentMethod === "cash"
                        ? "text-gray-600 dark:text-gray-300"
                        : "text-blue-400"
                    } text-sm`}
                  >
                    {order.paymentMethod === "cash" ? "Наличные" : "Онлайн"}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status === "completed"
                      ? "bg-green-200 text-green-800"
                      : order.status === "delivering"
                      ? "bg-blue-200 text-blue-800"
                      : "bg-yellow-200 text-yellow-800"
                  }`}
                >
                  {
                    {
                      pending: "В обработке",
                      delivering: "Доставляется",
                      completed: "Доставлен",
                    }[order.status]
                  }
                </span>
              </div>

              {/* Детали заказа */}
              <div className="mt-4 border-t pt-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex max-[480px]:flex-col  gap-3 justify-between items-center py-1 text-sm"
                  >
                    <div className="flex max-[480px]:flex-col items-center gap-2">
                      <span>{item.name}</span>
                      {item.extras.length > 0 && (
                        <span className="text-xs text-gray-500">
                          ({item.extras.join(", ")})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span>x{item.quantity}</span>
                      <span className="w-20 text-right text-green-500">
                        {(item.price * item.quantity).toFixed(2)} $
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
