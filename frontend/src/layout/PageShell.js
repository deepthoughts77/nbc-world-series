import React from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

export function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-white text-gray-900">
      <Nav />
      <main className="pb-16">{children}</main>
      <Footer />
    </div>
  );
}
