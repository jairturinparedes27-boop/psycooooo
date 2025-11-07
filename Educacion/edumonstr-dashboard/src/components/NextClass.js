// NextClass.js
import React from 'react';
import { Card, Button } from 'react-bootstrap';

export default function NextClass() {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>Próxima Clase</Card.Title>
        <Card.Text>Algoritmos Avanzados</Card.Text>
        <Button variant="primary">¡Llévame Ahora!</Button>
      </Card.Body>
    </Card>
  );
}
