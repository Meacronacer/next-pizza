import ResetPasswordConfirmForm from "@/forms/resetPasswordConfirmForm";

export const metadata = {
  title: "Reset Passoword",
  description: "Page for reset password",
  icon: "/favicon.ico",
};

const ResetPasswordPage = () => {
  return <ResetPasswordConfirmForm />;
};

export default ResetPasswordPage;
