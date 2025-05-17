// 3. src/app/bookings/_components/BookingForm.tsx
"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import InputGroup from "@/components/FormElements/InputGroup";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import { Select } from "@/components/FormElements/select";
import Link from "next/link";

interface Room {
  id: number;
  name: string;
}
interface BookingData {
  bookingDate: string;
  roomId: number;
}
interface BookingFormProps {
  editingId?: number;
}

export function BookingForm({ editingId }: BookingFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<BookingData>({ bookingDate: "", roomId: 0 });
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState<
    Partial<Record<keyof BookingData, string>>
  >({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // fetch rooms for select
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch("/api/rooms", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();
        setRooms(json.data);
      } catch (e: any) {
        console.error(e);
      }
    })();
  }, []);

  // fetch existing booking
  useEffect(() => {
    if (!editingId) return;
    (async () => {
      try {
      const token = localStorage.getItem("accessToken");
      const id = localStorage.getItem("idBooking");
      const bookingDate = localStorage.getItem("bookingDate");  
      const roomId = localStorage.getItem("roomIdBooking");
      setForm({
        bookingDate: bookingDate || "",
        roomId: Number(roomId) || 0,
      });
      // const res = await fetch(
      //   `https://simaru.amisbudi.cloud/api/bookings?id=${editingId}`,
      //   {
      //     headers: { Authorization: `Bearer ${token}` },
      //   },
      // );
      // const json = await res.json();
      // const payload = json.data ?? json;
      // const booking = Array.isArray(payload) ? payload[0] : payload;
      // if (!booking) throw new Error("Booking data not found");
      // console.log(payload);
      // console.log(booking);
      // if (res.ok && json.data) {
      //   setForm({
      //     bookingDate: booking.bookingDate ?? "",
      //     roomId: booking.room?.id ?? 0,
      //   });
      // } else {
      //   setError(json.message || "Failed to fetch booking");
      // }
      } catch (e: any) {
        console.error(e);
      }
    })();
  }, [editingId]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "roomId" ? Number(value) : value,
    }));
  };

  //validate
  function validate() {
    const err: { [key: string]: string } = {};
    if (!form.bookingDate) err.bookingDate = "Booking date is required";
    if (!form.roomId) err.roomId = "Room is required";
    setError(err);
    return Object.keys(err).length === 0;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;
    try {
      const token = localStorage.getItem("accessToken");
      const url = editingId ? `/api/bookings?id=${editingId}` : "/api/bookings";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Server error");
      sessionStorage.setItem(
        "bookingAlert",
        JSON.stringify({
          variant: "success",
          title: editingId ? "Booking Updated" : "Booking Added",
          description: json.message,
        }),
      );
      router.push("/pages/bookings");
    } catch (e: any) {
      sessionStorage.setItem(
        "bookingAlert",
        JSON.stringify({
          variant: "error",
          title: "Error",
          description: e.message,
        }),
      );
      router.push("/pages/bookings");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[10px] border border-stroke bg-white !p-6.5 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5"
    >
      {submitError && <p className="mb-4 text-red-500">{submitError}</p>}

      <DatePickerOne
        name="bookingDate"
        value={form.bookingDate}
        handleChange={handleChange}
      />
      {error.bookingDate && (
        <p className="text-sm text-red-500">{error.bookingDate}</p>
      )}

      <Select
        label="Room"
        name="roomId"
        className="mb-4.5"
        value={String(form.roomId)}
        onChange={handleChange}
        items={rooms.map((r) => ({ label: r.name, value: String(r.id) }))}
      />
      {error.roomId && <p className="text-sm text-red-500">{error.roomId}</p>}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.push("/pages/bookings")}
          className="flex w-20 justify-center rounded-lg bg-red p-[13px] font-medium text-white hover:bg-opacity-90"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex w-20 justify-center rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90"
        >
          {editingId ? "Update" : "Save"}
        </button>
      </div>
    </form>
  );
}
