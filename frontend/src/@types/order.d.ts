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

export interface Iorder {
  id: number;
  first_name: string;
  second_name: string;
  email: string;
  phone: string;
  address: string;
  comment: string;
  payment_type: "cash" | "card";
  subtotal: string;
  tax_amount: string;
  delivery_fee: string;
  final_total: string;
  status: "new" | "processing" | "completed";
  created_at: string;
  card_mask: string | null;
  card_type: string | null;
  liqpay_payment_id: string | null;
  payment_details: {
    description: string;
    img_url: string;
    card_type: string;
    card_mask: string;
  };
  items: IorderItem[];
}

interface OrderDetails {
  status: string;
  order_id: number;
  amount: number;
  delivery_fee: number;
  tax_amount: number;
  payment_date: string | null;
  items: OrderItem[];
}

interface IorderItem {
  id: number;
  product_id: number;
  img_url?: string | null;
  product_name: string;
  variant_id: number;
  variant_price: string;
  extras: IextrasOptions[];
  quantity: number;
  subtotal: string;
  product_data: {
    img_url: string;
    description: string;
  };
}
