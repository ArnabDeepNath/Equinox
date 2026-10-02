import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-[10px] px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-[#F5B301] hover:bg-[#e0a400] text-black",
        secondary:
          "border border-[#2A2A2A] bg-[#121212] hover:bg-[#1A1A1A] text-white hover:border-[#3A3A3A]",
        ghost: "text-[#A1A1A1] hover:text-white hover:bg-[#141414]",
        danger: "bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />;
}
