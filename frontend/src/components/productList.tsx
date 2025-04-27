import { Dispatch, SetStateAction } from "react";
import ProductItem from "./productItem";
import SkeletonProductItem from "@/skeletons/skeletonProductItem";
import { Iproduct } from "@/@types/product";
import { useProducts } from "@/api/productsApi";

import React from "react";
import { disableScroll } from "@/utils/scrollbar";

export interface IproductListProps {
  setProduct: Dispatch<SetStateAction<Iproduct | null>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const ProductList: React.FC<IproductListProps> = ({
  setProduct,
  setIsOpen,
}) => {
  const { data, isLoading, error } = useProducts();

  if (error) return <p className="py-40">Error loading products.</p>;

  // Список категорий по умолчанию для скелетонов
  const defaultCategories = [
    "pizzas",
    "snacks",
    "beverages",
    "cocktails",
    "coffe",
    "desserts",
    "sauces",
  ];

  // Если загрузка не идет и data существует – приводим Object.entries к нужному типу,
  // иначе создаём для скелетонов массив такого же типа:
  const categories: [string, Iproduct[]][] =
    !isLoading && data
      ? (Object.entries(data) as [string, Iproduct[]][])
      : defaultCategories.map((cat) => [cat, Array(8).fill(null)]);

  return (
    <div>
      {categories.map(([category, items], index) => (
        <section
          id={category.toLowerCase()}
          key={index}
          className="mb-10 scroll-mt-32"
        >
          <h2 className="text-2xl font-bold mb-4 capitalize">
            {isLoading ? (
              <div className="w-1/2 h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
            ) : (
              category
            )}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item, i) =>
              isLoading ? (
                <SkeletonProductItem key={i} />
              ) : (
                <ProductItem
                  key={i}
                  product={item as Iproduct}
                  setProduct={() => {
                    setProduct(item as Iproduct);
                    setIsOpen(true);
                    disableScroll();
                  }}
                />
              )
            )}
          </div>
        </section>
      ))}
    </div>
  );
};

export default ProductList;
