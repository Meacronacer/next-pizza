import {
  RegisterResponse,
  RegisterPayload,
  registerUser,
  loginUser,
  LoginPayload,
  requestPasswordReset,
  fetchUserProfile,
} from "@/api/authApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useUserProfile() {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    retry: false, // отключаем автоматический повтор запроса при ошибке
  });
}

export function useRegister() {
  return useMutation<RegisterResponse, Error, RegisterPayload>({
    mutationFn: registerUser,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation<RegisterResponse, Error, LoginPayload>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // При успешном логине сервер установил токены в куки,
      // дальше можно инвалидировать запрос профиля, чтобы он повторился
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      // Дополнительно можно обновить глобальное состояние авторизации,
      // перенаправить пользователя и т.п.
    },
  });
}
export function useResetPassword() {
  return useMutation<RegisterResponse, Error, RegisterPayload>({
    mutationFn: requestPasswordReset,
  });
}
