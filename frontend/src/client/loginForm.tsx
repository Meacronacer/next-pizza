"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/useAuth";
import useToastify from "@/hooks/useTostify";
import { LinkTo } from "@/utils/navigations";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { object, string } from "yup";

const userSchema = object({
  email: string().email().required("Email is required"),
  password: string().required("Password is required"),
});

interface Inputs {
  email: string;
  password: string;
}

const LoginForm = () => {
  const router = useRouter();
  const { toastError } = useToastify();
  const { mutate: loginUser, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(userSchema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    loginUser(
      {
        email: data.email,
        password: data.password,
      },
      { onSuccess: () => router.push(LinkTo.home) }
    );
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
  };

  return (
    <section className="flex flex-col w-full items-center mt-32 min-h-screen px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg">
        <h2 className="text-center text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Sign In
        </h2>
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="flex w-full items-center justify-center gap-x-2 border border-gray-300 dark:border-gray-700 rounded-md py-3 mb-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Image width={24} height={24} src="/google.svg" alt="Google" />
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            Continue with Google
          </span>
        </button>
        <div className="flex items-center mb-6">
          <hr className="flex-1 border-gray-300 dark:border-gray-700" />
          <span className="mx-3 text-sm text-gray-500 dark:text-gray-400">
            or
          </span>
          <hr className="flex-1 border-gray-300 dark:border-gray-700" />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            placeholder="Enter your email"
            error={errors.email}
            {...register("email")}
            type="email"
            containerClassName="grid gap-1"
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            error={errors.password}
            {...register("password")}
            type="password"
            containerClassName="grid gap-1"
          />
          <Button type="submit" variant="default" className="w-full mt-6">
            Sign In
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Link
            href={LinkTo.forgotPassword}
            className="text-sm hover:underline text-gray-600 dark:text-gray-300"
          >
            Forgot your password?
          </Link>
        </div>
        <div className="mt-2 text-center">
          <Link
            href={LinkTo.register}
            className="text-sm hover:underline text-gray-600 dark:text-gray-300"
          >
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
