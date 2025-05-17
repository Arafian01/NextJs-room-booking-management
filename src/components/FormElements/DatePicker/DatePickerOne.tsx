"use client";

import { Calendar } from "@/components/Layouts/sidebar/icons";
import flatpickr from "flatpickr";
import { useEffect, useRef } from "react";

interface DatePickerOneProps {
  name: string;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DatePickerOne({ name, value, handleChange }: DatePickerOneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    flatpickr(inputRef.current, {
      mode: "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      defaultDate: value || null,
      onChange: (selectedDates, dateStr) => {
        // simulate React change event
        const event = { target: { name, value: dateStr } } as React.ChangeEvent<HTMLInputElement>;
        handleChange(event);
      }
    });
  }, [value, name, handleChange]);

  return (
    <div>
      <label htmlFor={name} className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        Booking Date
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          ref={inputRef}
          type="text"
          className="form-datepicker w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary mb-4.5"
          placeholder="YYYY-MM-DD"
          value={value}
          onChange={handleChange}
        />
        <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center">
          <Calendar className="size-5 text-[#9CA3AF]" />
        </div>
      </div>
    </div>
  );
}
