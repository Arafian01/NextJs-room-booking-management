"use client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { TrashIcon, PencilSquareIcon } from "@/assets/icons";
import { DownloadIcon, PreviewIcon } from "@/components/Tables/icons";
import api from "@/lib/api";
import Cookies from "js-cookie";
import { cookies } from "next/headers";
import { on } from "events";

interface Category {
  id: number;
  name: string;
}
interface Room {
  id: number;
  name: string;
  categoryId: number;
  category: Category;
  price: number;
  capacity: number;
  description: string;
  status: string;
}

export function RoomTable() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchList();
    //remove cookies
    Cookies.remove("idRoom");
    Cookies.remove("nameRoom");
    Cookies.remove("categoryIdRoom");
    Cookies.remove("priceRoom");
    Cookies.remove("capacityRoom");
    Cookies.remove("descriptionRoom");
  }, []);

  async function fetchList() {
    try {
      const token = Cookies.get("accessToken");
      // console.log('Fetching rooms with token:', token);
      const res = await api.get("/rooms");
      // console.log('Rooms response:', res.data);
      setRooms(res.data.data || []);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch rooms:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load rooms. Please try again.",
      );
      if (err.response?.status === 401) {
        Cookies.remove("accessToken");
        router.push("/auth/login");
      }
    }
  }

  async function onDelete(id: number, name: string) {
    if (!confirm(`Delete room ${name}?`)) return;
    try {
      const res = await api.delete(`/rooms/${id}`);
      console.log("Delete response:", res.data);
      sessionStorage.setItem(
        "roomAlert",
        JSON.stringify({
          variant: "success",
          title: "Success",
          description: `Room ${name} deleted successfully.`,
        }),
      );
      fetchList();
    } catch (err: any) {
      console.error("Delete error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.details ||
        "Failed to delete room.";
      sessionStorage.setItem(
        "roomAlert",
        JSON.stringify({
          variant: "error",
          title: "Error",
          description: errorMessage,
        }),
      );
      if (err.response?.status === 401) {
        Cookies.remove("accessToken");
        router.push("/auth/login");
      }
    }
  }

  async function onSave(
    id: number,
    name: string,
    categoryId: number,
    price: number,
    capacity: number,
    description: string,
  ) {
    Cookies.set("idRoom", id.toString());
    Cookies.set("nameRoom", name);
    Cookies.set("categoryIdRoom", categoryId.toString());
    Cookies.set("priceRoom", price.toString());
    Cookies.set("capacityRoom", capacity.toString());
    Cookies.set("descriptionRoom", description);
  }

  return (
    <div className="space-y-10 rounded-[10px] border border-stroke bg-white p-4 text-right shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      {error && (
        <div className="mb-4 rounded bg-red-100 p-3 text-red-500">{error}</div>
      )}
      <Link
        href="/pages/rooms/create"
        className="rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90"
      >
        Add New
      </Link>
      <Table>
        <TableHeader>
          <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
            <TableHead className="text-center">NO</TableHead>
            <TableHead className="min-w-[155px] xl:pl-7.5">NAME</TableHead>
            <TableHead className="text-center">CAPACITY</TableHead>
            <TableHead className="text-center">CATEGORY</TableHead>
            <TableHead className="text-center">PRICE</TableHead>
            <TableHead className="text-center">STATUS</TableHead>
            <TableHead className="text-right xl:pr-7.5">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.map((room) => (
            <TableRow
              key={room.id}
              className="border-[#eee] dark:border-dark-3"
            >
              <TableCell>
                <p className="text-center text-dark dark:text-white">
                  {rooms.indexOf(room) + 1}
                </p>
                {room.id}
              </TableCell>
              <TableCell className="min-w-[155px] xl:pl-7.5">
                <p className="text-left text-dark dark:text-white">
                  {room.name}
                </p>
              </TableCell>
              <TableCell>
                <p className="text-center text-dark dark:text-white">
                  {room.capacity}
                </p>
              </TableCell>
              <TableCell>
                <div
                  className={cn(
                    "max-w-fit rounded-full px-3.5 py-1 text-center text-sm font-medium",
                  )}
                >
                  {room.category.name}
                </div>
              </TableCell>
              <TableCell>
                <p className="text-dark dark:text-white">{room.price}</p>
              </TableCell>
              <TableCell>
                <div
                  className={cn(
                    "max-w-fit rounded-full px-3.5 py-1 text-center text-sm font-medium",
                  )}
                >
                  {room.status}
                </div>
              </TableCell>
              <TableCell className="xl:pr-7.5">
                <div className="flex items-center justify-end gap-x-3.5">
                  <button className="hover:text-primary">
                    <span className="sr-only">View Invoice</span>
                    <PreviewIcon />
                  </button>
                  <Link
                    href={`/pages/rooms/${room.id}/edit`
                    } onClick={()=> onSave(
                      room.id,
                      room.name,
                      room.categoryId,
                      room.price,
                      room.capacity,
                      room.description,
                    )}
                    className="hover:text-primary"
                  >
                    <span className="sr-only">Edit Room</span>
                    <PencilSquareIcon />
                  </Link>
                  <button
                    className="hover:text-primary"
                    onClick={() => onDelete(room.id, room.name)}
                  >
                    <span className="sr-only">Delete Invoice</span>
                    <TrashIcon />
                  </button>
                  <button className="hover:text-primary">
                    <span className="sr-only">Download Invoice</span>
                    <DownloadIcon />
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
