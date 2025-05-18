"use client";
import { useState, useEffect, FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import InputGroup from "@/components/FormElements/InputGroup";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import { Select } from "@/components/FormElements/select";
import Link from "next/link";
import api from "@/lib/api";

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
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState<BookingData>({ bookingDate: "", roomId: 0 });
  const [rooms, setRooms] = useState<Room[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof BookingData, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!!editingId);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await api.get("/rooms");
        setRooms(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    }
    fetchRooms();
  }, []);

  useEffect(() => {
    async function fetchBooking() {
      if (!editingId) return;
      setIsLoading(true);
      try {
        const res = await api.get(`/bookings/${editingId}`);
        const booking = res.data;
        setForm({
          bookingDate: booking.bookingDate || "",
          roomId: booking.roomId || 0,
        });
      } catch (error) {
        console.error("Failed to fetch booking:", error);
        setSubmitError("Failed to load booking data.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchBooking();
  }, [editingId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "roomId" ? Number(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  function validate(formData: FormData): boolean {
    const err: typeof errors = {};
    const bookingDate = formData.get("bookingDate") as string;
    const roomId = Number(formData.get("roomId"));

    if (!bookingDate) err.bookingDate = "Booking date is required";
    if (!roomId) err.roomId = "Room is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    if (!validate(formData)) return;

    try {
      const payload = {
        bookingDate: formData.get("bookingDate") as string,
        roomId: Number(formData.get("roomId")),
      };
      const url = editingId ? `/bookings/${editingId}` : "/bookings";
      const method = editingId ? "put" : "post";
      const res = await api[method](url, payload);

      sessionStorage.setItem(
        "bookingAlert",
        JSON.stringify({
          variant: "success",
          title: editingId ? "Booking Updated" : "Booking Added",
          description: res.data.message || "Operation successful.",
        })
      );
      router.push("/pages/bookings");
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || "Operation failed.");
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-[10px] border border-stroke bg-white p-6.5 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5"
    >
      {submitError && (
        <p className="mb-4 text-red-500 bg-red-50 p-3 rounded">{submitError}</p>
      )}

      <DatePickerOne
        name="bookingDate"
        value={form.bookingDate}
        handleChange={handleChange}
        error={errors.bookingDate}
      />

      <Select
        label="Room"
        name="roomId"
        className="mb-4.5"
        value={String(form.roomId)}
        onChange={handleChange}
        items={rooms.map((r) => ({ label: r.name, value: String(r.id) }))}
        placeholder="Select room"
        error={errors.roomId}
      />

      <div className="flex justify-end space-x-4">
        <Link
          href="/pages/bookings"
          className="flex w-20 justify-center rounded-lg bg-red-500 p-[13px] font-medium text-white hover:bg-opacity-90"
        >
          Back
        </Link>
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-20 justify-center rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50"
        >
          {editingId ? "Update" : "Save"}
        </button>
      </div>
    </form>
  );
}