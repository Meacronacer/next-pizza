"use client";
import { ToastOptions, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface Sender {
  id: string;
  name: string;
  avatarUrl?: string;
}

const useToastify = () => {
  const options: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    theme: "dark",
  };

  const toastSuccess = (message: string, autoClose: number = 5000) => {
    toast.success(message, { ...options, autoClose });
  };

  const toastError = (message: string) => {
    toast.error(message, options);
  };

  const toastInfo = (message: string) => {
    toast.info(message, { ...options, autoClose: 15000 });
  };

  return { toastSuccess, toastError, toastInfo };
};

export default useToastify;
