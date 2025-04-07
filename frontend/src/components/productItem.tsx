const ProductItem = ({ product }: any) => {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 p-4 flex flex-col">
      {/* Изображение */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      {/* Контент */}
      <div className="flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {product.description}
          </p>
        )}
      </div>
      {/* Нижняя панель */}
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
          ${product.price.toFixed(2)}
        </span>
        <button className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors">
          Choose
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
