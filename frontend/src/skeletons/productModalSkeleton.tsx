import React from "react";

const SkeletonProductModal = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-y-auto max-h-[90vh]">
        {/* Кнопка закрытия */}
        <div className="absolute px-4 py-2 right-0.5 top-1">
          <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Левая колонка - изображение */}
          <div className="md:w-1/2 p-4 flex justify-center items-center h-auto md:h-[500px]">
            <div className="w-full h-64 md:h-full bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse" />
          </div>

          {/* Правая колонка - информация */}
          <div className="md:w-1/2 py-6 px-3.5 pt-12 flex flex-col h-auto md:h-[500px]">
            <div className="overflow-y-auto flex-grow pr-4">
              {/* Заголовок */}
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4 animate-pulse" />

              {/* Описание */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/5 animate-pulse" />
              </div>

              {/* Варианты размеров */}
              <div className="mt-6 space-y-2">
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/3 animate-pulse" />
                <div className="flex gap-3 mt-2">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-full h-10 bg-gray-300 dark:bg-gray-600 rounded-3xl animate-pulse"
                    />
                  ))}
                </div>
              </div>

              {/* Тип теста */}
              <div className="mt-6 space-y-2">
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/4 animate-pulse" />
                <div className="flex gap-3 mt-2">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-full h-10 bg-gray-300 dark:bg-gray-600 rounded-3xl animate-pulse"
                    />
                  ))}
                </div>
              </div>

              {/* Дополнительные опции */}
              <div className="mt-6 pb-6">
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-4 animate-pulse" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-20 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Футер */}
            <div className="mt-4">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4 animate-pulse" />
              <div className="w-full h-12 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonProductModal;
