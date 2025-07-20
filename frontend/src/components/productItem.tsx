import { Iproduct } from "@/@types/product";
import Image from "next/image";
import classNames from "classnames"; // Убедись, что установлен пакет: npm install classnames

interface props {
  product: Iproduct;
  setProduct: () => void;
}

const ProductItem: React.FC<props> = ({ product, setProduct }) => {
  if (!setProduct) return null;

  const outOfStock = !product?.in_stock;

  return (
    <div
      className={classNames(
        "relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow transition p-4 flex flex-col",
        {
          "opacity-60 cursor-not-allowed": outOfStock,
          "hover:shadow-lg": !outOfStock,
        }
      )}
    >
      {/* Метка "Out of Stock" */}
      {outOfStock && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
          Out of stock
        </div>
      )}

      {/* Изображение */}
      <Image
        onClick={!outOfStock ? setProduct : undefined}
        width={260}
        height={260}
        src={product?.img_url}
        alt={product?.name}
        className={classNames(
          "ml-2.5 mx-auto block w-full duration-300 rounded-md mb-4",
          {
            grayscale: outOfStock,
            "hover:translate-y-3 cursor-pointer": !outOfStock,
          }
        )}
      />

      {/* Контент */}
      <div className="flex-grow">
        <h3
          onClick={!outOfStock ? setProduct : undefined}
          className={classNames("text-xl font-semibold mb-2", {
            "text-gray-800 dark:text-gray-100 cursor-pointer": !outOfStock,
            "text-gray-500 dark:text-gray-400": outOfStock,
          })}
        >
          {product?.name}
        </h3>
        {product?.description && (
          <p
            onClick={!outOfStock ? setProduct : undefined}
            className={classNames("text-sm mb-4", {
              "text-gray-600 dark:text-gray-300 cursor-pointer": !outOfStock,
              "text-gray-500 dark:text-gray-400": outOfStock,
            })}
          >
            {product?.description}
          </p>
        )}
      </div>

      {/* Нижняя панель */}
      <div className="flex items-center justify-between">
        <span
          className={classNames("text-lg", {
            "cursor-pointer text-gray-800 dark:text-gray-100": !outOfStock,
            "text-gray-500 dark:text-gray-400": outOfStock,
          })}
        >
          from{" "}
          <strong className="text-green-400">${product?.price_from}</strong>
        </span>
        <button
          onClick={!outOfStock ? setProduct : undefined}
          disabled={outOfStock}
          className={classNames(
            "px-4 py-2 rounded-md text-sm transition-colors",
            {
              "bg-orange-500 hover:bg-orange-600 text-white cursor-pointer":
                !outOfStock,
              "bg-gray-400 text-white cursor-not-allowed": outOfStock,
            }
          )}
        >
          {outOfStock ? "Unavailable" : "Choose"}
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
