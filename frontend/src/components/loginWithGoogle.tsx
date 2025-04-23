"use client";
import { API_URL } from "@/api/base";
import { LinkTo } from "@/utils/navigations";
import { useGoogleLogin } from "@react-oauth/google";
import Image from "next/image";
import { useRouter } from "next/navigation";

const GoogleLoginButton = () => {
  const router = useRouter();
  const login = useGoogleLogin({
    onSuccess: async (response) => {
      const res = await fetch(API_URL + "/api/auth/google/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: response.access_token }),
      });

      if (res.ok) {
        // Перенаправление или обновление состояния
        router.push(LinkTo.home);
      }
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
