import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "premium-btn",
        secondary:
          "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[#181818]",
        ghost: "text-[var(--foreground)] hover:bg-[#171717]",
        danger: "bg-red-600 text-white hover:bg-red-700",
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