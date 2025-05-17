// components/FormElements/select.tsx
"use client";

import { ChevronUpIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { useId, useState, SelectHTMLAttributes } from "react";

interface Option { label: string; value: string; }

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  items: Option[];
  prefixIcon?: React.ReactNode;
  className?: string;
};

export function Select({
  label,
  items,
  prefixIcon,
  className,
  ...props  // now includes name, value, onChange, defaultValue, placeholder, etc.
}: SelectProps) {
  const id = useId();
  const [isOptionSelected, setIsOptionSelected] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsOptionSelected(true);
    props.onChange?.(e);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <label
        htmlFor={id}
        className="block text-body-sm font-medium text-dark dark:text-white"
      >
        {label}
      </label>

      <div className="relative">
        {prefixIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            {prefixIcon}
          </div>
        )}

        <select
          id={id}
          className={cn(
            "w-full appearance-none rounded-lg border border-stroke bg-transparent px-5.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary [&>option]:text-dark-5 dark:[&>option]:text-dark-6",
            isOptionSelected && "text-dark dark:text-white",
            prefixIcon && "pl-11.5",
          )}
          onChange={handleChange}
          {...props}    // forward name, value, defaultValue, placeholder, etc.
        >
          {props.placeholder && (
            <option value="" disabled hidden>
              {props.placeholder}
            </option>
          )}

          {items.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <ChevronUpIcon className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-180" />
      </div>
    </div>
  );
}
