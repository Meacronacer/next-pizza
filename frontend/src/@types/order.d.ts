export interface IpaymentVerify {
  orderId: string;
  token: string;
}

export interface OrderItemPayload {
  product_id: number;
  product_name: string;
  variant_id: number;
  variant_price: number;
  extras: {
    id: number;
    name: string;
    price: number;
    img_url?: string;
  }[];
  quantity: number;
  subtotal: string;
}

export interface OrderPayload {
  first_name: string;
  second_name: string;
  email: string;
  phone: string;
  address: string;
  comment?: string;
  payment_type: "cash" | "card";
  items: OrderItemPayload[];
}
