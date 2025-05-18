import { NextPage } from 'next';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { RoomForm } from "../../_components/RoomForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Room",
};

interface EditRoomPageProps {
  params: Promise<{ id: string }>;
}

const EditRoomPage: NextPage<EditRoomPageProps> = async ({ params }) => {
  const { id } = await params; // Await the params Promise

  return (
    <div className="relative mx-auto w-full max-w-[1080px]">
      <Breadcrumb pageName="Edit Room" />
      <RoomForm editingId={Number(id)} />
    </div>
  );
};

export default EditRoomPage;