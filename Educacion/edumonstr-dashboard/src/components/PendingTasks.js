// PendingTasks.js
import React from 'react';
import { ListGroup } from 'react-bootstrap';

export default function PendingTasks() {
  const tasks = [
    'Algoritmos Avanzados',
    'Proyecto de Recetas',
    'Ensayo de Ética',
    'Laboratorio de Física'
  ];

  return (
    <div className="mb-3">
      <h5>Tareas Pendientes</h5>
      <ListGroup>
        {tasks.map((task, idx) => (
          <ListGroup.Item key={idx}>{task}</ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
