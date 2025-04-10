export interface Iproduct {
  id: number;
  key: string;
  product_id?: string;
  name: string;
  img_url: string;
  product_type: string;
  price_from: number;
  description: string;
  extra_info?: string;
}

export interface IProductsApiResponse {
  pizzas: IProduct[];
  snacks: IProduct[];
  cocktails: IProduct[];
  cofe: IProduct[];
}
