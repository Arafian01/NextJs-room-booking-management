"use client";
import { useState, useEffect } from "react";
import { Alert } from "@/components/ui-elements/alert";

export default function BookingsAlert() {
  const [alert, setAlert] = useState<any>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("bookingAlert");
    if (raw) {
      setAlert(JSON.parse(raw));
      sessionStorage.removeItem("bookingAlert");
      setTimeout(() => setAlert(null), 3000);
    }
  }, []);

  if (!alert) return null;

  return (
    <div className="fixed top-35 right-4 z-50 w-80">
      <Alert
        variant={alert.variant}
        title={alert.title}
        description={alert.description}
      />
    </div>
  );
}