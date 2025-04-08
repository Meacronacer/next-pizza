"use client";

import { Dispatch, SetStateAction } from "react";
import ProductItem from "./productItem";
import { Iproduct } from "@/@types/product";
import { useProducts } from "@/api/fetchProducts";
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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading products.</p>;
  if (!data) return null; // или можно вернуть заглушку

  return (
    <div>
      {Object.entries(data).map(([category, items]) => (
        <section key={category} className="mb-10">
          <h2 className="text-2xl font-bold mb-4 capitalize">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((product: Iproduct) => (
              <ProductItem
                setProduct={() => {
                  setProduct(product);
                  setIsOpen(true);
                  disableScroll();
                }}
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default ProductList;
