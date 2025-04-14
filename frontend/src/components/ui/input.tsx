import React, { forwardRef, InputHTMLAttributes } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "../../utils/twMerge";
import { FieldError } from "react-hook-form";

const InputVariants = cva(
  `h-[40px] border-2 w-full text-[14px] font-medium focus:outline-none`,
  {
    variants: {
      variant: {
        default: "mb-2 mr-2.5 w-full rounded-lg px-4",
      },
      error: {
        true: "border-red-800",
        false: "dark:border-white/10 border-black/10",
      },
    },
    defaultVariants: {
      variant: "default",
      error: false,
    },
  }
);

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    Omit<VariantProps<typeof InputVariants>, "error"> {
  label?: string; // Метка над полем
  error?: FieldError | undefined; // Ошибка из react-hook-form
  containerClassName?: string; // Классы для контейнера
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, containerClassName, variant, ...props }, ref) => {
    return (
      <div className={cn("relative flex flex-col gap-1", containerClassName)}>
        {label && <label className="font-bold">{label}</label>}
        <input
          ref={ref}
          className={cn(InputVariants({ variant, error: !!error, className }))}
          {...props}
        />
        {error && (
          <p className="absolute -bottom-2.5 text-[10px] text-red-500">
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, InputVariants };
