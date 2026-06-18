import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  htmlFor: string;
  className?: string;
  children: ReactNode;
};

export function Field({ label, htmlFor, className, children }: FieldProps) {
  return (
    <div className={cn("grid gap-2 text-sm font-medium", className)}>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
}

type TimeFieldProps = {
  label: string;
  className?: string;
  children: ReactNode;
};

export function TimeField({ label, className, children }: TimeFieldProps) {
  return (
    <fieldset className={cn("grid gap-2 border-0 p-0", className)}>
      <legend className="text-sm font-medium">{label}</legend>
      {children}
    </fieldset>
  );
}
