// src/components/AdminPanel.js
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Tabs, Tab } from 'react-bootstrap';

export default function AdminPanel() {
  const [alumno, setAlumno] = useState({
    nombre: '', apellido: '', fecha_nac: '', telefono: '', correo: '', carrera: ''
  });

  const [profesor, setProfesor] = useState({
    nombre: '', apellido: '', especialidad: '', email: '', telefono: ''
  });

  const handleAlumnoChange = (e) => {
    setAlumno({ ...alumno, [e.target.name]: e.target.value });
  };

  const handleProfesorChange = (e) => {
    setProfesor({ ...profesor, [e.target.name]: e.target.value });
  };

  const registrarAlumno = (e) => {
    e.preventDefault();
    console.log('Alumno registrado:', alumno);
    // Aquí puedes hacer un POST al backend con fetch o axios
  };

  const registrarProfesor = (e) => {
    e.preventDefault();
    console.log('Profesor registrado:', profesor);
    // Aquí puedes hacer un POST al backend con fetch o axios
  };

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">Panel de Administración</h2>
      <Tabs defaultActiveKey="alumno" className="mb-3">
        <Tab eventKey="alumno" title="Registrar Alumno">
          <Card className="p-4">
            <Form onSubmit={registrarAlumno}>
              <Row>
                <Col md={6}><Form.Group><Form.Label>Nombre</Form.Label><Form.Control name="nombre" value={alumno.nombre} onChange={handleAlumnoChange} /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label>Apellido</Form.Label><Form.Control name="apellido" value={alumno.apellido} onChange={handleAlumnoChange} /></Form.Group></Col>
              </Row>
              <Row>
                <Col md={6}><Form.Group><Form.Label>Fecha de Nacimiento</Form.Label><Form.Control type="date" name="fecha_nac" value={alumno.fecha_nac} onChange={handleAlumnoChange} /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label>Teléfono</Form.Label><Form.Control name="telefono" value={alumno.telefono} onChange={handleAlumnoChange} /></Form.Group></Col>
              </Row>
              <Row>
                <Col md={6}><Form.Group><Form.Label>Correo</Form.Label><Form.Control type="email" name="correo" value={alumno.correo} onChange={handleAlumnoChange} /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label>Carrera</Form.Label><Form.Control name="carrera" value={alumno.carrera} onChange={handleAlumnoChange} /></Form.Group></Col>
              </Row>
              <Button type="submit" className="mt-3">Registrar Alumno</Button>
            </Form>
          </Card>
        </Tab>

        <Tab eventKey="profesor" title="Registrar Profesor">
          <Card className="p-4">
            <Form onSubmit={registrarProfesor}>
              <Row>
                <Col md={6}><Form.Group><Form.Label>Nombre</Form.Label><Form.Control name="nombre" value={profesor.nombre} onChange={handleProfesorChange} /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label>Apellido</Form.Label><Form.Control name="apellido" value={profesor.apellido} onChange={handleProfesorChange} /></Form.Group></Col>
              </Row>
              <Row>
                <Col md={6}><Form.Group><Form.Label>Especialidad</Form.Label><Form.Control name="especialidad" value={profesor.especialidad} onChange={handleProfesorChange} /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label>Email</Form.Label><Form.Control type="email" name="email" value={profesor.email} onChange={handleProfesorChange} /></Form.Group></Col>
              </Row>
              <Form.Group><Form.Label>Teléfono</Form.Label><Form.Control name="telefono" value={profesor.telefono} onChange={handleProfesorChange} /></Form.Group>
              <Button type="submit" className="mt-3">Registrar Profesor</Button>
            </Form>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
}
