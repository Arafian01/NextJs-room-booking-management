// src/app/rooms/[id]/edit/page.tsx
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import { RoomForm } from "../../_components/RoomForm";

export const metadata: Metadata = {
  title: "Edit Room",
};

interface EditRoomPageProps {
  params: {
    id: string;
  };
}

export default function EditRoomPage({ params }: EditRoomPageProps) {
  const roomId = Number(params.id);

  return (
    <div className="mx-auto w-full max-w-[1080px] p-6">
      <Breadcrumb pageName="Edit Room" />
      <div className="mt-6">
        <RoomForm editingId={roomId} />
      </div>
    </div>
  );
}
