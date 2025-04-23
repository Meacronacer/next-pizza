"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string, ref } from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import useToastify from "@/hooks/useTostify";
import { useResetPasswordConfirm } from "@/hooks/useAuth";

const schema = object({
  newPassword: string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  confirmPassword: string()
    .oneOf([ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

interface Inputs {
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordConfirmForm = () => {
  const router = useRouter();
  const { mutate: resetPassword, isPending } = useResetPasswordConfirm();
  const searchParams = useSearchParams();
  const { uidb64, token } = useParams();
  const { toastInfo, toastError } = useToastify();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!uidb64 || !token) {
      toastError("Invalid URL parameters.");
      return;
    }

    resetPassword(
      {
        uid: uidb64,
        token,
        new_password: data.newPassword,
      },
      {
        onSuccess: (info) => {
          toastInfo(info.message);
          router.push("/login");
        },
        onError: (info) => {
          toastError(info?.message || "Failed, please try again later");
        },
      }
    );
  };

  return (
    <section className="flex flex-col w-full items-center justify-center min-h-screen px-4">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg">
        <h2 className="text-center text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            placeholder="Enter new password"
            type="password"
            error={errors.newPassword}
            {...register("newPassword")}
            containerClassName="grid gap-1"
          />
          <Input
            placeholder="Confirm new password"
            type="password"
            error={errors.confirmPassword}
            {...register("confirmPassword")}
            containerClassName="grid gap-1"
          />
          <Button
            isLoading={isPending}
            disabled={isPending}
            type="submit"
            variant="default"
            className="w-full mt-4"
          >
            Reset Password
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ResetPasswordConfirmForm;
