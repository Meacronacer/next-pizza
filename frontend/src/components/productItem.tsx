import { Iproduct } from "@/@types/product";
import Image from "next/image";

interface props {
  product: Iproduct;
  setProduct: () => void;
}

const ProductItem: React.FC<props> = ({ product, setProduct }) => {
  if (!setProduct) return null;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col">
      {/* Изображение */}
      <Image
        onClick={setProduct}
        width={260}
        height={260}
        src={product?.img_url}
        alt={product?.name}
        className="hover:translate-y-3 ml-2.5 mx-auto block w-full duration-300 cursor-pointer rounded-md mb-4"
      />
      {/* Контент */}
      <div className="flex-grow">
        <h3
          onClick={setProduct}
          className="text-xl cursor-pointer font-semibold text-gray-800 dark:text-gray-100 mb-2"
        >
          {product.name}
        </h3>
        {product.description && (
          <p
            onClick={setProduct}
            className="text-sm cursor-pointer text-gray-600 dark:text-gray-300 mb-4"
          >
            {product?.description}
          </p>
        )}
      </div>
      {/* Нижняя панель */}
      <div className="flex items-center justify-between">
        <span
          onClick={setProduct}
          className="text-lg cursor-pointer  text-gray-800 dark:text-gray-100"
        >
          from{" "}
          <strong className="text-green-400">
            ${product?.price_from?.toFixed(2)}
          </strong>
        </span>
        <button
          onClick={setProduct}
          className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
        >
          Choose
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
