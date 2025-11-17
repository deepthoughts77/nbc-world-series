import React from "react";
import { Container } from "../components/common/Container";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <Container className="py-10 text-center space-y-2">
        <p className="font-medium">National Baseball Congress World Series</p>
        <p className="text-gray-500 text-sm">
          © 2024 NBC Baseball Foundation · Wichita, Kansas
        </p>
      </Container>
    </footer>
  );
}
