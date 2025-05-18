"use client";

import { Calendar } from "@/components/Layouts/sidebar/icons";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  name: string;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export default function DatePickerOne({ name, value, handleChange, error }: DatePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const fp = flatpickr(inputRef.current, {
      mode: "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d", // Format for API (YYYY-MM-DD)
      altInput: true, // User-friendly display
      altFormat: "M j, Y", // Display format (e.g., Jan 15, 2025)
      defaultDate: value || undefined, // Use undefined instead of null
      onChange: (selectedDates) => {
        if (selectedDates[0]) {
          const event = {
            target: {
              name,
              value: selectedDates[0].toISOString().split("T")[0], // Format YYYY-MM-DD
            },
          } as React.ChangeEvent<HTMLInputElement>;
          handleChange(event);
        }
      },
    });

    return () => {
      fp.destroy();
    };
  }, [name, value, handleChange]);

  return (
    <div className="mb-4.5">
      <label
        className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
      >
        Booking Date
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text" // Use text to avoid native date picker
          name={name}
          value={value}
          onChange={handleChange}
          className={cn(
            "form-datepicker w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary",
            error && "border-red-500 focus:border-red-500"
          )}
          placeholder="mm/dd/yyyy"
          data-class="flatpickr-right"
        />
        <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
          <Calendar className="size-5 text-[#9CA3AF]" />
        </div>
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}