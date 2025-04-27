import { IproductDetails, IProductsApiResponse } from "@/@types/product";

export const fetchProducts = async (): Promise<IProductsApiResponse> => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/products/get-all/",
    {
      credentials: "include", // отправляет куки вместе с запросом
    }
  );
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
};

export const fetchProductDetail = async (
  productId: string
): Promise<IproductDetails> => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/api/products/get-product/${productId}/`,
    {
      credentials: "include", // отправляет куки вместе с запросом
    }
  );
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
};
