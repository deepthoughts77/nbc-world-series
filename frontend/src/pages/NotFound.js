// frontend/src/pages/NotFound.js
import React from "react";
import { Link } from "react-router-dom";
import { Container } from "../components/common/Container";
import { Card, CardBody } from "../components/common/Card";

export default function NotFound() {
  return (
    <Container className="py-12">
      <Card>
        <CardBody>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Page not found
          </h1>
          <p className="text-sm text-gray-600 mb-4">
            The page you’re looking for doesn’t exist.
          </p>
          <Link
            to="/"
            className="inline-flex items-center text-sm text-blue-700 hover:underline"
          >
            Go back home
          </Link>
        </CardBody>
      </Card>
    </Container>
  );
}
