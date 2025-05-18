import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { BookingTable } from "./_components/BookingTable";
import BookingsAlert from "./_components/BookingAlert";

export const metadata: Metadata = { title: "Bookings Page" };

export default function BookingsPage() {
  return (
    <div className="relative mx-auto w-full max-w-[1080px]">
      <BookingsAlert />
      <Breadcrumb pageName="Bookings" />
      <div className="space-y-10">
        <BookingTable />
      </div>
    </div>
  );
}