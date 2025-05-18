import { Suspense } from 'react';
import { RoomForm } from "../_components/RoomForm";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Room",
};

export default function CreateRoomPage() {
  return (
    <div className="relative mx-auto w-full max-w-[1080px]">
      <Breadcrumb pageName="Create Room" />
      <Suspense fallback={<div>Loading...</div>}>
        <RoomForm />
      </Suspense>
    </div>
  );
}