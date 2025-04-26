import {
  IloginForm,
  ILoginResponse,
  ImessageResponse,
  IregisterForm,
  IresetPasswordConfirm,
} from "@/@types/auth";
import {
  registerUser,
  loginUser,
  requestPasswordReset,
  fetchUserProfile,
  confirmPasswordReset,
  logout,
  loginUserWithGoogle,
} from "@/api/authApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useUserProfile() {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    retry: false, // отключаем автоматический повтор запроса при ошибке
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function useRegister() {
  return useMutation<ImessageResponse, Error, IregisterForm>({
    mutationFn: registerUser,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation<ILoginResponse, Error, IloginForm>({
    mutationFn: loginUser,
    onSuccess: () => {
      // При успешном логине сервер установил токены в куки,
      // дальше можно инвалидировать запрос профиля, чтобы он повторился
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      // Дополнительно можно обновить глобальное состояние авторизации,
      // перенаправить пользователя и т.п.
    },
  });
}

export function useLoginWithGoogle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginUserWithGoogle,
    onSuccess: () => {
      // При успешном логине сервер установил токены в куки,
      // дальше можно инвалидировать запрос профиля, чтобы он повторился
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      // Дополнительно можно обновить глобальное состояние авторизации,
      // перенаправить пользователя и т.п.
    },
  });
}

export function useRequestResetPassword() {
  return useMutation<ImessageResponse, Error, { email: string }>({
    mutationFn: requestPasswordReset,
  });
}

export function useResetPasswordConfirm() {
  return useMutation<ImessageResponse, Error, IresetPasswordConfirm>({
    mutationFn: confirmPasswordReset,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Очистка кэша профиля пользователя
      queryClient.removeQueries({ queryKey: ["userProfile"] });
    },
  });
}
