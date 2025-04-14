"use client";
import React from "react";

const SkeletonCheckoutPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 mt-16 mb-10">
      <div className="animate-pulse">
        {/* Заголовок */}
        <div className="h-10 bg-gray-300 rounded w-1/2 mx-auto mb-6"></div>

        <form className="flex flex-col md:flex-row gap-6">
          {/* Левая колонка */}
          <div className="flex-1 flex flex-col gap-6">
            {/* 1. Cart Section Skeleton */}
            <div className="rounded-[30px] p-4 sm:p-6 bg-gray-100 dark:bg-gray-800 w-full shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/6"></div>
              </div>
              <hr className="mb-4 border-gray-300" />
              <div className="space-y-4">
                {/* Блок имитирующий список товаров */}
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="border-b pb-4 last:border-b-0 flex flex-col md:flex-row gap-4"
                  >
                    {/* Изображение товара */}
                    <div className="w-20 h-20 bg-gray-300 rounded-lg"></div>
                    <div className="flex flex-col flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-300 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Personal Info Section Skeleton */}
            <div className="rounded-[30px] p-4 sm:p-6 bg-gray-100 dark:bg-gray-800 w-full shadow-xl">
              <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
              <hr className="mb-4 border-gray-300" />
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 tablet:grid-cols-1">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-10 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>

            {/* 3. Delivery Address Section Skeleton */}
            <div className="rounded-[30px] p-4 sm:p-6 bg-gray-100 dark:bg-gray-800 w-full shadow-xl">
              <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
              <hr className="mb-4 border-gray-300" />
              <div className="space-y-4">
                <div className="h-10 bg-gray-300 rounded"></div>
                <div className="h-16 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>

          {/* Правая колонка */}
          <div className="w-full md:w-1/3">
            <div className="flex flex-col gap-6 md:top-[130px]">
              {/* 4. Payment Section Skeleton */}
              <div className="rounded-[30px] p-4 sm:p-6 bg-gray-100 dark:bg-gray-800 shadow-xl">
                <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
                <hr className="mb-4 border-gray-300" />
                <div className="space-y-3">
                  <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>

              {/* 5. Order Summary Section Skeleton */}
              <div className="rounded-[30px] p-4 sm:p-6 bg-gray-100 dark:bg-gray-800 shadow-xl">
                <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
                <hr className="mb-4 border-gray-300" />
                <div className="space-y-4">
                  <div className="h-5 bg-gray-300 rounded w-full"></div>
                  <div className="h-5 bg-gray-300 rounded w-full"></div>
                  <div className="h-5 bg-gray-300 rounded w-full"></div>
                  <div className="h-8 bg-gray-300 rounded w-full mt-4"></div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkeletonCheckoutPage;
