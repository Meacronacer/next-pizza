"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { useClearCart } from "@/hooks/useCart";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LinkTo } from "@/utils/navigations";
import SkeletonCheckoutPage from "@/skeletons/skeletoCheckoutPage";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useUserProfile } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { useCreateOrder, useLiqpayInit } from "@/hooks/useOrders";
import Script from "next/script";
import { API_URL } from "@/api/base";
import { IextrasOptions } from "@/@types/product";
import { OrderPayload } from "@/@types/order";
import useToastify from "@/hooks/useTostify";
import { formatPhoneNumber } from "@/utils/phoneFormat";
import { useCartSummary } from "@/hooks/useCartSummary";

interface Inputs {
  first_name: string;
  second_name: string;
  email: string;
  phone: string;
  address: string;
  paymentType: "card" | "cash";
  comment?: string;
}

// 2. Явно укажем тип для Yup-схемы
const deliverySchema = yup
  .object({
    first_name: yup
      .string()
      .required("First Name is required")
      .min(2, "min 2 characters"),
    second_name: yup
      .string()
      .required("Last Name is required")
      .min(2, "min 2 characters"),
    email: yup.string().email().required("Email is required"),
    phone: yup
      .string()
      .required("Phone is required")
      .matches(
        /^\+380 \(\d{2}\) \d{3} \d{2} \d{2}$/,
        "Invalid phone number format. Example: +380 (XX) XXX XX XX"
      ),
    address: yup.string().required("address is required"),
    comment: yup.string().optional().default(undefined),
    paymentType: yup.string().optional().default(undefined),
  })
  .required() as unknown as yup.ObjectSchema<Inputs>;

const CheckoutForm: React.FC = () => {
  const [liqPayData, setLiqPayData] = React.useState<{
    data: string;
    signature: string;
  } | null>(null);

  const router = useRouter();
  const { data: user } = useUserProfile();
  const { toastSuccess } = useToastify();
  const { mutate: clearCart, isPending } = useClearCart();
  const { mutate: liqpayInit, isPending: isLiqpayPending } = useLiqpayInit();
  const { mutate: createOrder, isPending: createOrderLoading } =
    useCreateOrder();

  const {
    items: data,
    isLoading,
    isUpdating,
    error,
    subtotal,
    tax,
    total,
    deliveryFee,
    changeQuantity,
  } = useCartSummary();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(deliverySchema),
    mode: "onBlur",
    defaultValues: {
      first_name: user?.first_name || "",
      second_name: user?.second_name || "",
      email: user?.email || "",
      phone: "",
      address: "",
      comment: "",
      paymentType: "cash", // Значение по умолчанию
    },
  });

  useEffect(() => {
    setValue("first_name", user?.first_name);
    setValue("second_name", user?.second_name);
    setValue("email", user?.email);
  }, [user, setValue]);

  if (isLoading || isPending) {
    return <SkeletonCheckoutPage />;
  }

  if (error)
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        Ошибка при загрузке корзины
      </div>
    );

  if (data && data?.length === 0)
    return (
      <div className="container mx-auto p-4 my-40 text-center">
        <h2 className="text-xl font-bold mb-4">Ваша корзина пуста</h2>
        <p className="mb-8">
          Пожалуйста, добавьте товары в корзину, чтобы оформить заказ.
        </p>
        <Button className="mx-auto" onClick={() => router.push(LinkTo.home)}>
          Вернуться в магазин
        </Button>
      </div>
    );

  const paymentType = watch("paymentType");

  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    // Преобразуем данные корзины в массив позиций для заказа
    const orderItems =
      data?.map((item) => {
        // Преобразуем доп опции в ожидаемый формат
        const extrasPayload = item.extras.map((extra: IextrasOptions) => ({
          id: extra.id, // убедитесь, что у extra есть поле id
          name: extra.name,
          price: extra.price,
          img_url: extra?.img_url,
        }));

        // Поле product_name берем из item.name
        // variant_price можем задать как цену варианта из item.price
        // Вычисляем итоговую стоимость позиции:
        const unitPrice =
          item.price +
          item.extras.reduce(
            (sum: number, extra: IextrasOptions) => sum + extra.price,
            0
          );
        const subtotal = unitPrice * item.quantity;

        return {
          product_id: Number(item.product_id),
          product_name: item.name,
          variant_id: Number(item.variant_id),
          variant_price: Number(item.price),
          extras: extrasPayload,
          quantity: item.quantity,
          subtotal: subtotal.toFixed(2),
        };
      }) || [];

    const orderPayload: OrderPayload = {
      first_name: formData.first_name,
      second_name: formData.second_name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      comment: formData.comment,
      payment_type: formData.paymentType,
      items: orderItems,
    };

    createOrder(orderPayload, {
      onSuccess: (newOrder) => {
        if (formData.paymentType === "card") {
          liqpayInit(newOrder.id, {
            onSuccess: ({ data, signature }) => {
              setLiqPayData({ data, signature });
            },
          });
        } else {
          toastSuccess("Order created successfully!");
          router.push(LinkTo.home); // перенаправляем пользователя на страницу благодарности
        }
      },
    });

    // Вызов мутации для создания заказа, например useCreateOrder().mutate(orderPayload)
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 max-[480px]:mt-20 mt-16 mb-10">
      <h1 className="text-center text-2xl sm:text-3xl font-bold mb-6">
        Checkout
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:flex-row gap-6"
      >
        {/* Левая колонка */}
        <div className="flex-1 flex flex-col gap-6">
          {/* 1. Cart Section */}
          <section className="rounded-[30px] relative p-4 sm:p-6 bg-gray-100 dark:bg-gray-800 w-full shadow-xl">
            {isUpdating && (
              <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
              </div>
            )}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold">1. Cart</h2>
              <button
                onClick={() => clearCart()}
                type="button"
                className="flex cursor-pointer items-center gap-x-1 text-xs sm:text-sm font-medium hover:opacity-70"
              >
                {/* Кнопка очистки корзины */}
                Clear cart
              </button>
            </div>
            <hr className="mb-4 border-gray-300" />
            <div className="space-y-4">
              {data?.map((item) => {
                const pricePerUnit =
                  item.price +
                  item.extras.reduce(
                    (sum: number, extra: IextrasOptions) => sum + extra.price,
                    0
                  );
                return (
                  <div key={item.key} className="border-b pb-4 last:border-b-0">
                    <div className="flex max-[480px]:items-center  max-[480px]:flex-col justify-between items-start gap-4">
                      {/* Левая часть: изображение и информация */}
                      <div className="flex gap-4">
                        <Image
                          width={80}
                          height={80}
                          src={item.img_url}
                          alt={item.name}
                          className="w-20 h-20 max-[480px]:w-32 max-[480px]:h-32 object-cover rounded-lg"
                        />
                        <div className="flex flex-col">
                          <h3 className="font-medium text-lg">{item.name}</h3>
                          <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                            <div>Basic price: {item.price.toFixed(2)} $</div>
                            {item.extras.length > 0 && (
                              <div className="mt-1">
                                Additionaly:
                                {item.extras.map((extra: IextrasOptions) => (
                                  <div key={extra.name} className="ml-2">
                                    + {extra.name} ({extra.price.toFixed(2)} $)
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="mt-1 text-xs text-green-600">
                            Price per unit: {pricePerUnit.toFixed(2)} $
                          </div>
                        </div>
                      </div>

                      {/* Правая часть: управление количеством и итоговая стоимость */}
                      <div
                        className="flex  flex-col items-end gap-2
                        max-[480px]:flex-row-reverse
                        max-[480px]:justify-center
                        max-[480px]:w-full
                        max-[480px]:gap-16
                        "
                      >
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              changeQuantity(item.key, item.quantity - 1)
                            }
                            className="w-8 h-8 cursor-pointer flex items-center justify-center rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm"
                          >
                            -
                          </button>
                          <span className="min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              changeQuantity(item.key, item.quantity + 1)
                            }
                            className="w-8 h-8 cursor-pointer flex items-center justify-center rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-lg font-semibold text-green-500 sm:mt-4 sm:mr-5.5">
                          {(pricePerUnit * item.quantity).toFixed(2)} $
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 2. Personal Info Section */}
          <section className="rounded-[30px] p-4 sm:p-6 bg-gray-100 dark:bg-gray-800 w-full shadow-xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              2. Personal Info
            </h2>
            <hr className="mb-4 border-gray-300" />
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 tablet:grid-cols-1">
              <Input
                label="First Name"
                type="text"
                placeholder="Enter first name"
                className="border rounded p-2 bg-transparent text-sm"
                {...register("first_name")}
                error={errors.first_name}
              />

              <Input
                label="Last Name"
                type="text"
                placeholder="Enter last name"
                className="border rounded p-2 bg-transparent text-sm"
                {...register("second_name")}
                error={errors.second_name}
              />

              <Input
                label="E-mail"
                type="email"
                placeholder="Enter email"
                className="border rounded p-2 bg-transparent text-sm"
                {...register("email")}
                error={errors.email}
              />

              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Input
                    label="Phone"
                    type="tel"
                    placeholder="+380 (__) ___ __ __"
                    value={value || ""}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value);
                      onChange(formatted);
                    }}
                    onBlur={onBlur}
                    ref={ref}
                    error={errors.phone}
                    className="border rounded p-2 bg-transparent text-sm"
                  />
                )}
              />
            </div>
          </section>

          {/* 3. Delivery Address Section */}
          <section className="rounded-[30px] p-4 sm:p-6 bg-gray-100 dark:bg-gray-800 w-full shadow-xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              3. Delivery Address
            </h2>
            <hr className="mb-4 border-gray-300" />
            <div className="flex flex-col gap-3 sm:gap-4">
              <Input
                label="Address"
                type="text"
                placeholder="Enter delivery address"
                className="border rounded bg-transparent text-sm"
                {...register("address")}
                error={errors.address}
              />
              <div className="flex flex-col gap-1">
                <label className="font-bold">Comment</label>
                <textarea
                  placeholder="Additional instructions"
                  className="border dark:border-white/10 border-black/10 focus:outline-0 rounded p-2 bg-transparent text-sm resize-none"
                  rows={3}
                  {...register("comment")}
                ></textarea>
              </div>
            </div>
          </section>
        </div>

        {/* Правая колонка */}
        <div className="w-full md:w-1/3">
          <div className="flex flex-col gap-6 md:top-[130px]">
            {/* 4. Payment Section */}
            <section className="rounded-[30px] p-4 sm:p-6 bg-gray-100 dark:bg-gray-800 shadow-xl">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">4. Payment</h2>
              <hr className="mb-4 border-gray-300" />
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="cash"
                    value="cash"
                    {...register("paymentType")}
                  />
                  <label htmlFor="cash">Cash on delivery</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="card"
                    value="card"
                    {...register("paymentType")}
                  />
                  <label htmlFor="card">Pay with Liqpay</label>
                </div>
              </div>
            </section>

            {/* 5. Order Summary Section */}
            <section className="rounded-[30px] relative p-4 sm:p-6 bg-gray-100 dark:bg-gray-800 shadow-xl">
              {isUpdating && (
                <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
                </div>
              )}

              <h2 className="text-xl sm:text-2xl font-bold mb-4">
                Order Summary
              </h2>
              <hr className="mb-4 border-gray-300" />
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 w-full text-sm">
                  <span className="flex-1 text-nowrap">Total Value</span>
                  <span className="flex‑1 pt-2 border-b border-dotted w-full" />
                  <span className="font-bold text-green-500 text-nowrap">
                    {subtotal.toFixed(2)} $
                  </span>
                </div>
                <div className="flex items-center gap-2 w-full text-sm">
                  <span className="flex-1">Taxes</span>
                  <span className="flex‑1 pt-2 border-b border-dotted w-full" />
                  <span className="font-bold text-green-600 text-nowrap">
                    {tax.toFixed(2)} $
                  </span>
                </div>
                <div className="flex items-center gap-2 w-full text-sm">
                  <span className="flex-1">Delivery</span>
                  <span className="flex‑1 pt-2 border-b border-dotted w-full" />
                  <span className="font-bold text-green-600 text-nowrap">
                    {deliveryFee.toFixed(2)} $
                  </span>
                </div>
                <div className="border-t pt-4 flex items-center gap-2 w-full text-xl font-bold">
                  <span className="flex-1">Total</span>
                  <span className="flex‑1 pt-2 border-b border-dotted w-full" />
                  <span className="text-green-400 text-nowrap">
                    {total.toFixed(2)} $
                  </span>
                </div>
              </div>
              <Button
                isLoading={createOrderLoading}
                disabled={createOrderLoading || isUpdating || isLiqpayPending}
                type="submit"
                className={`mt-6 w-full ${
                  paymentType === "card" && "bg-green-400"
                }`}
              >
                {paymentType === "cash" ? "Place Order" : "Pay with Liqpay"}
              </Button>
            </section>
          </div>
        </div>
      </form>
      {liqPayData && (
        <>
          <form
            id="liqpay-form"
            method="POST"
            action="https://www.liqpay.ua/api/3/checkout"
            acceptCharset="utf-8"
            style={{ display: "none" }}
          >
            <input type="hidden" name="data" value={liqPayData.data} />
            <input
              type="hidden"
              name="signature"
              value={liqPayData.signature}
            />
          </form>
          {/* Load LiqPay SDK afterInteractive so it doesn't block LCP :contentReference[oaicite:0]{index=0} */}
          <Script
            id="liqpay-sdk"
            src="https://static.liqpay.ua/libjs/sdk.js"
            strategy="afterInteractive" /* :contentReference[oaicite:1]{index=1} */
          />
          {/* Auto‑submit once SDK has loaded */}
          <Script id="liqpay-submit" strategy="afterInteractive">{`
      document.getElementById('liqpay-form').submit();
    `}</Script>
        </>
      )}
    </div>
  );
};

export default CheckoutForm;
