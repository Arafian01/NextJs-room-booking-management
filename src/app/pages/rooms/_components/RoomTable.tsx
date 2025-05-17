'use client';
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

import { TrashIcon, PencilSquareIcon,  } from '@/assets/icons';
import { DownloadIcon, PreviewIcon } from "@/components/Tables/icons";

interface Category { id: number; name: string; /*...*/ }
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

export  function RoomTable() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("accessToken");

  useEffect(() => { 
    fetchList();
    localStorage.removeItem('idRoom');
    localStorage.removeItem('nameRoom');
    localStorage.removeItem('categoryIdRoom');
    localStorage.removeItem('priceRoom');
    localStorage.removeItem('capacityRoom');
    localStorage.removeItem('descriptionRoom');
  }, []);
  async function fetchList(){
    const res = await fetch('/api/rooms', {
      headers:{ 
        Authorization:`Bearer ${token}` 
      }, credentials:'include' });
    const json = await res.json();
    setRooms(json.data||[]);
  }
  async function onDelete(id:number, name:string){
    // if(!confirm('Hapus room${id} ?')) return;
    if(!confirm(`Delete room ${name} ?`)) return;
    const res = await fetch(`/api/rooms?id=${id}`, { 
      method:'DELETE', 
      headers:{ Authorization:`Bearer ${token}` } });
    if(res.ok) {
      fetchList(); 
    // if (!res.ok) {
      // sessionStorage.setItem(
      //   "roomAlert",
      //   JSON.stringify({
      //     variant: "success",
      //     title: "Success",
      //     description: "Operation successful.",
      //   }),
      // );
    // } else {
    } else 
    {
      alert((await res.json()).message);
      // sessionStorage.setItem(
      //   "roomAlert",
      //   JSON.stringify({
      //     variant: "error",
      //     title: "Error",
      //     description: "Operation failed.",
      //   }),
      // );
    }
  }

  async function onSave(id:number, name:string, categoryId:number, price:number, capacity:number, description:string){
    localStorage.setItem("idRoom", id.toString());
    localStorage.setItem("nameRoom", name);
    localStorage.setItem("categoryIdRoom", categoryId.toString());
    localStorage.setItem("priceRoom", price.toString());
    localStorage.setItem("capacityRoom", capacity.toString());
    localStorage.setItem("descriptionRoom", description);
  }


  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5 space-y-10 text-right">
          <Link href="./rooms/create" className="rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90">
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
                    {/* urutan angka dari 1  */}
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
                <div
                  className={cn(
                    "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium text-center",
                  )}
                >
                  {room.category.name}
                </div>
              </TableCell>

                <TableCell>
                    <p className="text-dark dark:text-white">
                    {room.price}
                    </p>
                </TableCell>

                <TableCell>
                    <div
                    className={cn(
                        "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium text-center ",
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

                <Link href={`/pages/rooms/${room.id}/edit`} onClick={()=> onSave(room.id, room.name, room.categoryId, room.price, room.capacity, room.description)} className="hover:text-primary">
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
