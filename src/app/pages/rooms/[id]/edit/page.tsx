import { use } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import { RoomForm } from "../../_components/RoomForm";

export const metadata: Metadata = {
  title: "Edit Room",
};

export default function EditRoomPage(props: { params: Promise<{ id: string }> }) {
  // unwrap the promise
  const { id } = use(props.params);
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
