import OrdersPageClient from "@/client/ordersPageClient";

export const metadata = {
  title: "My Orders",
  description: "Page for my orders",
  icon: "/favicon.ico",
};

const OrderPage = () => {
  return <OrdersPageClient />;
};

export default OrderPage;
