"use client";
import { useState, useEffect } from "react";
import { Alert } from "@/components/ui-elements/alert";

export default function RoomsAlert() {
  const [alert, setAlert] = useState<{ variant: "success" | "error"; title: string; description: string } | null>(null);

  useEffect(() => {
    const roomAlert = sessionStorage.getItem('roomAlert');
    if (roomAlert) {
      setAlert(JSON.parse(roomAlert));
      sessionStorage.removeItem('roomAlert');
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