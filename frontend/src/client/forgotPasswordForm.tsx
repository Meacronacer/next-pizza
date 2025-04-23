"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useToastify from "@/hooks/useTostify";
import { LinkTo } from "@/utils/navigations";
import BackIcon from "@/assets/back.svg"; // SVG импортирован через SVGR
import { useRequestResetPassword } from "@/hooks/useAuth";

const schema = object({
  email: string().email("Invalid email").required("Email is required"),
});

interface Inputs {
  email: string;
}

const ForgotPasswordForm = () => {
  const router = useRouter();
  const { toastInfo, toastError } = useToastify();
  const { mutate: forgotPassword, isPending } = useRequestResetPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    // Здесь будет логика отправки запроса для сброса пароля
    forgotPassword(
      { email: data.email },
      {
        onSuccess: (info) => {
          toastInfo(info.message);
          router.push(LinkTo.login);
        },
        onError: (info) => {
          toastError(info?.message || "Failed, please try again later");
        },
      }
    );
  };

  return (
    <section className="flex flex-col w-full items-center justify-center min-h-screen px-4 ">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg">
        {/* Ссылка "Back" */}
        <Link
          href={LinkTo.login}
          className="absolute left-4 top-4 flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 group"
        >
          <BackIcon className="w-5 h-5 group-hover:text-gray-500 dark:group-hover:text-gray-400" />
          <span className="group-hover:text-gray-500 dark:group-hover:text-gray-400">
            Back
          </span>
        </Link>

        <h2 className="text-center text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            placeholder="Enter your email"
            type="email"
            error={errors.email}
            {...register("email")}
            containerClassName="grid gap-1"
          />
          <Button
            isLoading={isPending}
            disabled={isPending}
            type="submit"
            variant="default"
            className="w-full mt-4"
          >
            Send Reset Link
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ForgotPasswordForm;
