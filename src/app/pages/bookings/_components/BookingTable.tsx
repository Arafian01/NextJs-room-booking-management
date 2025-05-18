"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { TrashIcon, PencilSquareIcon } from "@/assets/icons";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import api from "@/lib/api";

interface Booking {
  id: number;
  bookingDate: string;
  room: { id: number; name: string; price: number };
}

export function BookingTable() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const fetchList = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const onDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus booking #${id}?`)) return;
    try {
      await api.delete(`/bookings/${id}`);
      fetchList();
      sessionStorage.setItem(
        "bookingAlert",
        JSON.stringify({
          variant: "success",
          title: "Booking Deleted",
          description: `Booking #${id} deleted successfully.`,
        })
      );
    } catch (error: any) {
      sessionStorage.setItem(
        "bookingAlert",
        JSON.stringify({
          variant: "error",
          title: "Error",
          description: error.response?.data?.message || "Failed to delete booking.",
        })
      );
    }
  };

  return (
    <div className="space-y-10 rounded-[10px] border border-stroke bg-white p-4 text-right shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <Link
        href="/pages/bookings/create"
        className="rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90"
      >
        Add New
      </Link>
      <Table>
        <TableHeader>
          <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
            <TableHead className="text-center">NO</TableHead>
            <TableHead className="min-w-[155px] xl:pl-7.5">ROOM</TableHead>
            <TableHead className="text-center">BOOKING DATE</TableHead>
            <TableHead className="text-center">PRICE</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((b, i) => (
            <TableRow key={b.id} className="border-[#eee] dark:border-dark-3">
              <TableCell>
                <p className="text-center text-dark dark:text-white">{i + 1}</p>
              </TableCell>
              <TableCell className="min-w-[155px] xl:pl-7.5">
                <p className="text-left text-dark dark:text-white">{b.room.name}</p>
              </TableCell>
              <TableCell>
                <p className="text-center text-dark dark:text-white">{b.bookingDate}</p>
              </TableCell>
              <TableCell>
                <p className="text-center text-dark dark:text-white">{b.room.price}</p>
              </TableCell>
              <TableCell className="xl:pr-7.5">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/pages/bookings/${b.id}/edit`}
                    className="hover:text-primary"
                  >
                    <span className="sr-only">Edit Booking</span>
                    <PencilSquareIcon />
                  </Link>
                  <button
                    className="hover:text-primary"
                    onClick={() => onDelete(b.id, b.room.name)}
                  >
                    <span className="sr-only">Delete Booking</span>
                    <TrashIcon />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}