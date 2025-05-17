"use client";
import { useState, useEffect } from "react";
import { Alert } from "@/components/ui-elements/alert";

export default function RoomsAlert() {
    const [a,setA] = useState<any>(null);
   useEffect(()=>{ 
    const r=sessionStorage.getItem('roomAlert'); 
    if(r){ 
        setA(JSON.parse(r)); 
        sessionStorage.removeItem('roomAlert'); 
        setTimeout(()=>setA(null),3000);
    } 
    },[]);

if(!a) return null;
  return <div className="fixed top-35 right-4 z-50 w-80">
    <Alert 
    variant={a.variant} 
    title={a.title} 
    description={a.description}/>
    </div>;
}

