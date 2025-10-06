import React from "react";
import { Loader2 } from "lucide-react";

//overlay loader
export default function Loader() {
  return (
    <div className="flex justify-center items-center h-screen absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  );
}
