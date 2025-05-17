import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import { RoomTable } from "./_components/RoomTable";
import RoomsAlert from "./_components/RoomAlert";

export const metadata: Metadata = {
  title: "Rooms Page",
};

export default function RoomsPage() {
  return (
    <div className="relative mx-auto w-full max-w-[1080px]">
      <RoomsAlert />
      <Breadcrumb pageName="Rooms" />
      <div className="space-y-10">
        <RoomTable />
      </div>
    </div>
  );
}