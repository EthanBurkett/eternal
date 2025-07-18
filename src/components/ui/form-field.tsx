import { cn } from "@/lib/utils";
import { FormFieldProps } from "@/types/form";

export function FormField({
  label,
  error,
  children,
  className,
  required = false,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2 w-full", className)}>
      {label && (
        <label className="text-sm font-medium leading-none">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
