import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { BookingForm } from "../../_components/BookingForm";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Booking" };

export default function EditBookingPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6">
      <Breadcrumb pageName="Edit Booking" />
      <BookingForm editingId={Number(params.id)} />
    </div>
  );
}