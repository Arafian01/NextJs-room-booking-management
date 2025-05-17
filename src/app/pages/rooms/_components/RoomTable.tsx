'use client';
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { TrashIcon, PencilSquareIcon } from '@/assets/icons';
import { DownloadIcon, PreviewIcon } from "@/components/Tables/icons";
import api from "@/lib/api";

interface Category { id: number; name: string; }
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
  const router = useRouter();

  useEffect(() => {
    fetchList();
  }, []);

  async function fetchList() {
    try {
      const res = await api.get('/rooms',);
      setRooms(res.data.data || []);
      console.log(res.data.data);
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
    }
  }

  async function onDelete(id: number, name: string) {
    if (!confirm(`Delete room ${name}?`)) return;
    try {
      await api.delete(`/rooms/${id}`);
      sessionStorage.setItem(
        "roomAlert",
        JSON.stringify({
          variant: "success",
          title: "Success",
          description: `Room ${name} deleted successfully.`,
        })
      );
      fetchList();
    } catch (err: any) {
      sessionStorage.setItem(
        "roomAlert",
        JSON.stringify({
          variant: "error",
          title: "Error",
          description: err.response?.data?.message || "Failed to delete room.",
        })
      );
    }
  }

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5 space-y-10 text-right">
      <Link href="/pages/rooms/create" className="rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90">
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
            <TableRow key={room.id} className="border-[#eee] dark:border-dark-3">
              <TableCell>
                <p className="text-dark dark:text-white text-center">
                  {rooms.indexOf(room) + 1}
                </p>
              </TableCell>
              <TableCell className="min-w-[155px] xl:pl-7.5">
                <p className="text-dark dark:text-white text-left">
                  {room.name}
                </p>
              </TableCell>
              <TableCell>
                <p className="text-dark dark:text-white text-center">
                  {room.capacity}
                </p>
              </TableCell>
              <TableCell>
                <div className={cn("max-w-fit rounded-full px-3.5 py-1 text-sm font-medium text-center")}>
                  {room.category.name}
                </div>
              </TableCell>
              <TableCell>
                <p className="text-dark dark:text-white">
                  {room.price}
                </p>
              </TableCell>
              <TableCell>
                <div className={cn("max-w-fit rounded-full px-3.5 py-1 text-sm font-medium text-center")}>
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
                    href={{
                      pathname: `/pages/rooms/${room.id}/edit`,
                      query: {
                        id: room.id,
                        name: room.name,
                        categoryId: room.categoryId,
                        price: room.price,
                        capacity: room.capacity,
                        description: room.description,
                      },
                    }}
                    className="hover:text-primary"
                  >
                    <span className="sr-only">Edit Room</span>
                    <PencilSquareIcon />
                  </Link>
                  <button className="hover:text-primary" onClick={() => onDelete(room.id, room.name)}>
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