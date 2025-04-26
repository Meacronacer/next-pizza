import PaymentSuccessPageSuspense from "@/client/paymentSuccessSuspense";

export const metadata = {
  title: "Payment Success",
  description: "Page for payment success",
  icon: "/favicon.ico",
};

const PaymentSuccessPage = () => {
  return <PaymentSuccessPageSuspense />;
};

export default PaymentSuccessPage;
