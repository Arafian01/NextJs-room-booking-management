import { NextPage } from 'next';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { BookingForm } from "../../_components/BookingForm";
import { Metadata } from "next";

export const metadata: Metadata = { 
  title: "Edit Booking"
};

interface EditBookingPageProps {
  params: Promise<{ id: string }>;
}

const EditBookingPage: NextPage<EditBookingPageProps> = async ({ params }) => {
  const { id } = await params; // Await the params Promise

  return (
    <div className="relative mx-auto w-full max-w-[1080px]">
      <Breadcrumb pageName="Edit Room" />
      <BookingForm editingId={Number(id)} />
    </div>
  );
};

export default EditBookingPage;