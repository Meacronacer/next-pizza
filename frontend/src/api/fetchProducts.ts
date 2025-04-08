// hooks/useProducts.ts
import { IProductsApiResponse } from "@/@types/product";
import { ProductDetailData } from "@/components/productModal";
import { useQuery } from "@tanstack/react-query";

const fetchProducts = async (): Promise<IProductsApiResponse> => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/products/get-all",
    {
      credentials: "include", // отправляет куки вместе с запросом
    }
  );
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
};

const fetchProductDetail = async (
  productId: string
): Promise<ProductDetailData> => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/api/products/get-product/${productId}`,
    {
      credentials: "include", // отправляет куки вместе с запросом
    }
  );
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
};

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // кешировать данные 5 минут
  });
};

export const useProductDetail = (productId: string) => {
  return useQuery({
    queryKey: ["productDetail", productId],
    queryFn: () => fetchProductDetail(productId),
    // Используем "enabled", чтобы запрос не срабатывал, если productId отсутствует
    enabled: productId !== undefined && productId !== "", // Запрос срабатывает только если productId определён
    staleTime: 1000 * 60 * 5, // кешировать данные 5 минут
  });
};
