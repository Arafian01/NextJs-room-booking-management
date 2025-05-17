// src/app/rooms/[id]/edit/page.tsx
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import { RoomForm } from "../../_components/RoomForm";

export const metadata: Metadata = {
  title: "Edit Room",
};

// Tell TS that params is a Promise<{ id: string }>
interface EditRoomPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRoomPage({ params }: EditRoomPageProps) {
  const { id } = await params;
  const roomId = Number(id);

  return (
    <div className="mx-auto w-full max-w-[1080px] p-6">
      <Breadcrumb pageName="Edit Room" />
      <div className="mt-6">
        <RoomForm editingId={roomId} />
      </div>
    </div>
  );
}
