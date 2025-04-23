export interface Iproduct {
  id: number;
  key:? string;
  product_id?: string;
  name: string;
  product_type: string;
  img_url: string;
  price_from: number;
  description: string;
  extra_info?: string;
}

export interface IextrasOptions {
  id: number;
  name: string;
  price: number;
  img_url?: string;
}

export interface Ivariants {
  id: number;
  size?: string;
  price: number;
}

export interface IproductDetails {
  variants: Ivariants[];
  extra_options: IextrasOptions[];
}

export interface IProductsApiResponse {
  pizzas: IProduct[];
  snacks: IProduct[];
  cocktails: IProduct[];
  cofe: IProduct[];
}
