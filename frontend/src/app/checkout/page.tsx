import CheckoutForm from "@/client/checkoutForm";

export const metadata = {
  title: "Checkout",
  description: "Page for submit order",
};

const CheckoutPage = async () => {
  return <CheckoutForm />;
};

export default CheckoutPage;
