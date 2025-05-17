// src/app/pages/bookings/[id]/edit/page.tsx
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import { BookingForm } from "../../_components/BookingForm"; // your form component

export const metadata: Metadata = {
  title: "Edit Booking",
};

interface EditBookingPageProps {
  // NOTE: params is now a promise
  params: Promise<{ id: string }>;
}

export default async function EditBookingPage({ params }: EditBookingPageProps) {
  // await the promise to get the actual params object
  const { id } = await params;
  const bookingId = Number(id);

  return (
    <div className="mx-auto w-full max-w-[1080px] p-6">
      <Breadcrumb pageName="Edit Booking" />
      <div className="mt-6">
        <BookingForm editingId={bookingId} />
      </div>
    </div>
  );
}
