import React from "react";

const SkeletonProductItem: React.FC = () => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow p-4 flex flex-col animate-pulse">
    {/* Скелетон изображения */}
    <div className="w-full h-40 bg-gray-300 dark:bg-gray-700 rounded mb-4" />
    {/* Скелетоны для текста */}
    <div className="flex-grow">
      <div className="w-3/4 h-6 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
      <div className="w-full h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
    </div>
    {/* Скелетон для нижней панели (цена и кнопку) */}
    <div className="flex items-center justify-between">
      <div className="w-1/2 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
      <div className="w-1/3 h-8 bg-gray-300 dark:bg-gray-700 rounded" />
    </div>
  </div>
);

export default SkeletonProductItem;
