import ForgotPasswordForm from "@/forms/forgotPasswordForm";

export const metadata = {
  title: "Forgot Password",
  description: "Page for reset password with email",
  icon: "/favicon.ico",
};

const ForgotPasswordPage = () => {
  return <ForgotPasswordForm />;
};

export default ForgotPasswordPage;
