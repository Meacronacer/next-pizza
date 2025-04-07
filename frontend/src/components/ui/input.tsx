import { VariantProps, cva } from "class-variance-authority";
import { cn } from "../../utils/twMerge";
import { InputHTMLAttributes } from "react";
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
        false: "dark:border-white/10  border-black/10",
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
  error?: FieldError | undefined; // Сообщение об ошибке (текст)
  containerClassName?: string; // Классы для контейнера
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  containerClassName,
  variant,
  ...props
}) => {
  return (
    <div className={cn("relative", containerClassName)}>
      {label && <label>{label}</label>}
      <input
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
};

export { Input, InputVariants };
