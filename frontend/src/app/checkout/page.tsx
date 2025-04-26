import CheckoutForm from "@/forms/checkoutForm";

export const metadata = {
  title: "Checkout",
  description: "Page for submit order",
  icon: "/favicon.ico",
};

const CheckoutPage = () => {
  return <CheckoutForm />;
};

export default CheckoutPage;
