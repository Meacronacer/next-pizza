"use client";
import { useLoginWithGoogle } from "@/hooks/useAuth";
import useToastify from "@/hooks/useTostify";
import { LinkTo } from "@/utils/navigations";
import { useGoogleLogin } from "@react-oauth/google";
import Image from "next/image";
import { useRouter } from "next/navigation";

const GoogleLoginButton = () => {
  const router = useRouter();
  const { toastError } = useToastify();
  const { mutate: loginUserWithGoogle } = useLoginWithGoogle();

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      loginUserWithGoogle(response.access_token, {
        onSuccess: () => {
          router.push(LinkTo.home);
        },
        onError: (error) => {
          toastError(error.message);
        },
      });
    },
  });

  return (
    <button
      onClick={() => login()}
      type="button"
      className="flex w-full cursor-pointer items-center justify-center gap-x-2 border border-gray-300 dark:border-gray-700 rounded-md py-3 mb-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      <Image width={24} height={24} src="/google.svg" alt="Google" />
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
        Continue with Google
      </span>
    </button>
  );
};

export default GoogleLoginButton;
