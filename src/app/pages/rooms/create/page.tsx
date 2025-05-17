"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { RoomForm } from "../_components/RoomForm";

export default function CreateRoomPage() {
  return (
    <div className="p-6">
      <Breadcrumb pageName="Add Booking" />
      <RoomForm />
    </div>
  );
}
