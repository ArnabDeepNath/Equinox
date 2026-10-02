import { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-[var(--border)] bg-[#0e0e0e] px-3 py-2 text-sm text-[var(--foreground)] outline-none ring-[var(--gold)] placeholder:text-[var(--muted-foreground)] focus:ring-2",
        className,
      )}
      {...props}
    />
  );
}