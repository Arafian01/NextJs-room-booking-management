// 5. src/app/bookings/create/page.tsx
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { BookingForm } from '../_components/BookingForm';

export default function CreateBookingPage() {
  return (
    <div className="p-6">
      <Breadcrumb pageName="Add Booking" />
      <BookingForm />
    </div>
  );
}