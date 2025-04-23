import { IextrasOptions } from "./product";

export interface IcartItem {
  key: string;
  product_id: number;
  variant_id: number;
  extras: IextrasOptions[];
  quantity: number;
  price: number;
  name: string;
  img_url: string;
  subtotal: number;
}

export interface IupdateCartItemQuantity {
  item_key: string;
  quantity: number;
}

export interface IeditCartItem {
  item_key?: string | null;
  variant_id: number;
  extras: number[];
}

export interface IaddToCart {
  product_id?: number;
  variant_id: number;
  extras?: number[];
  quantity?: number;
}
