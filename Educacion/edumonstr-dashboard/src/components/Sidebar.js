// Sidebar.js
import React from 'react';
import { Nav } from 'react-bootstrap';

export default function Sidebar() {
  return (
    <Nav className="flex-column bg-dark text-white p-3 vh-100" style={{ width: '250px' }}>
      <h4 className="mb-4">EduMonstr</h4>
      <Nav.Link href="#" className="text-white">Inicio</Nav.Link>
      <Nav.Link href="#" className="text-white">Mis Cursos</Nav.Link>
      <Nav.Link href="#" className="text-white">Mi Horario</Nav.Link>
      <Nav.Link href="#" className="text-white">Calificaciones</Nav.Link>
    </Nav>
  );
}
