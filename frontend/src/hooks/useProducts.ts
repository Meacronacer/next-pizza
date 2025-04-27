import { fetchProductDetail, fetchProducts } from "@/api/productsApi";
import { useQuery } from "@tanstack/react-query";

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
