// 2. src/app/bookings/_components/BookingTable.tsx
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

interface Booking {
  id: number;
  bookingDate: string;
  room: { id: number; name: string; price: number };
}

export function BookingTable() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const token = localStorage.getItem("accessToken");

  const fetchList = async () => {
    const res = await fetch("/api/bookings", {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    const json = await res.json();
    setBookings(json.data || []);
  };

  useEffect(() => {
    fetchList();
    localStorage.removeItem("idBooking");
    localStorage.removeItem("bookingDate");
    localStorage.removeItem("roomIdBooking");
  }, []);

  const onDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus booking #${id}?`)) return;
    const res = await fetch(`/api/bookings?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchList();
    else alert((await res.json()).message);
  };

  async function onSave(id:number, bookingDate:string, roomId:number){
    localStorage.setItem("idBooking", id.toString());
    localStorage.setItem("bookingDate", bookingDate);
    localStorage.setItem("roomIdBooking", roomId.toString());
  }

  return (
    <div className="space-y-10 rounded-[10px] border border-stroke bg-white p-4 text-right shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <Link
        href="./bookings/create"
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
                <p className="text-center text-dark dark:text-white">
                  {/* urutan angka dari 1  */}
                  {bookings.indexOf(b) + 1}
                </p>
              </TableCell>

              <TableCell className="min-w-[155px] xl:pl-7.5">
                <p className="text-left text-dark dark:text-white">
                  {b.room.name}
                </p>
              </TableCell>

              <TableCell>
                <p className="text-center text-dark dark:text-white">
                  {b.bookingDate}
                </p>
              </TableCell>
              <TableCell>
                <p className="text-center text-dark dark:text-white">
                  {b.room.price}
                </p>
              </TableCell>

              <TableCell className="xl:pr-7.5">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/pages/bookings/${b.id}/edit`}
                    onClick={() =>
                      onSave(b.id, b.bookingDate, b.room.id)
                    }
                    className="hover:text-primary"
                  >
                  <span className="sr-only">Edit Bookings</span>
                    <PencilSquareIcon />
                  </Link>

                  <button className="hover:text-primary" onClick={() => onDelete(b.id, b.room.name)}>
                    <span className="sr-only">Delete Invoice</span>
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
