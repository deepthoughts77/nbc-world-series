import React from "react";
import { AlertCircle } from "lucide-react";

export function BannerError({ message }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 p-4 flex items-center gap-2">
      <AlertCircle size={18} />
      <span className="text-sm">{message}</span>
    </div>
  );
}
