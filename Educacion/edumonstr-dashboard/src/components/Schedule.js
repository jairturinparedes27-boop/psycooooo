// Schedule.js
import React from 'react';
import { Table } from 'react-bootstrap';

export default function Schedule() {
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  return (
    <div className="mb-3">
      <h5>Mi Horario</h5>
      <Table bordered>
        <thead>
          <tr>{days.map(day => <th key={day}>{day}</th>)}</tr>
        </thead>
        <tbody>
          <tr>{days.map(day => <td key={day}>Clase</td>)}</tr>
        </tbody>
      </Table>
    </div>
  );
}
