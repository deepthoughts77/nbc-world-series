import React from "react";
import { Container } from "../components/common/Container";
import { Card, CardBody } from "../components/common/Card";

export function NotFound() {
  return (
    <Container className="py-20">
      <Card>
        <CardBody className="text-center">
          <h1 className="text-2xl font-bold">Page not found</h1>
          <p className="text-gray-600 mt-2">Check the URL and try again.</p>
        </CardBody>
      </Card>
    </Container>
  );
}
