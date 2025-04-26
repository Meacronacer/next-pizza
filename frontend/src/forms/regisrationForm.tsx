"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegister } from "@/hooks/useAuth";
import useToastify from "@/hooks/useTostify";
import { LinkTo } from "@/utils/navigations";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { object, string, ref } from "yup";

const schema = object({
  first_name: string()
    .required("First name is required")
    .min(2, "Min 2 characters"),
  second_name: string()
    .required("Second name is required")
    .min(2, "Min 2 characters"),
  email: string().email().required("Email is required"),
  password: string().required("Password is required"),
  passwordConfirm: string()
    .oneOf([ref("password"), undefined], "Passwords must match")
    .required("Password confirmation is required"),
});

interface Inputs {
  first_name: string;
  second_name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const RegistrationForm = () => {
  const { toastInfo, toastError } = useToastify();
  const router = useRouter();
  const { mutate: registerUser, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    registerUser(
      {
        first_name: data.first_name,
        second_name: data.second_name,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: (info) => {
          toastInfo(info?.message);
          reset();
          router.push(LinkTo.login);
        },
        onError: (info) => {
          toastError(info?.message);
        },
      }
    );
  };

  return (
    <section className="flex flex-col w-full items-center mt-32 min-h-screen px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg">
        <h2 className="text-center text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="First name"
              error={errors.first_name}
              {...register("first_name")}
              type="text"
              containerClassName="grid gap-1"
            />
            <Input
              label="Last Name"
              placeholder="Last name"
              error={errors.second_name}
              {...register("second_name")}
              type="text"
              containerClassName="grid gap-1"
            />
          </div>
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
          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            error={errors.passwordConfirm}
            {...register("passwordConfirm")}
            type="password"
            containerClassName="grid gap-1"
          />
          <Button
            disabled={isPending}
            isLoading={isPending}
            type="submit"
            className="w-full mt-4"
          >
            Sign Up
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Link
            href={LinkTo.login}
            className="text-sm hover:underline text-gray-600 dark:text-gray-300"
          >
            Already have an account? Sign In
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm;
