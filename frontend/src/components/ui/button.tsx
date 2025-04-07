import { VariantProps, cva } from "class-variance-authority";
import { cn } from "../../utils/twMerge";

const ButtonsVariants = cva(
  `flex items-center justify-center gap-x-2 h-[44px] px-5 py-[10px] text-base font-medium rounded-lg transition-colors duration-300
   focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none cursor-pointer
   disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap`,
  {
    variants: {
      variant: {
        default: `bg-orange-500 text-white`,
      },
      loading: {
        true: "opacity-75 pointer-events-none",
      },
    },
    defaultVariants: {
      variant: "default",
      loading: false,
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ButtonsVariants> {
  isLoading?: boolean; // Состояние загрузки
  icon?: React.ReactNode; // Иконка
}

const Button: React.FC<ButtonProps> = ({
  className,
  variant,
  isLoading = false,
  icon,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        ButtonsVariants({ variant, loading: isLoading }),
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && icon}
      {children}
    </button>
  );
};

export { Button, ButtonsVariants };
