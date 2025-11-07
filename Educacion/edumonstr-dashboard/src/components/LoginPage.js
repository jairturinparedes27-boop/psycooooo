// src/components/LoginPage.js
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import './LoginPage.css'; // Estilos personalizados

export default function LoginPage({ onLoginSuccess }) {
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de autenticación
    if (usuario && contraseña) {
      onLoginSuccess?.(); // Si se pasa como prop
    }
  };

  return (
    <div className="login-background">
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Row>
          <Col>
            <Card className="p-4 shadow-lg login-card">
              <h2 className="text-center mb-3">MONSTRUM</h2>
              <p className="text-center text-muted mb-4">Gestión Académica Avanzada</p>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Usuario o Correo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa tu usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Iniciar Sesión
                </Button>
              </Form>
              <div className="text-center mt-3">
                <a href="#" className="forgot-link">¿Olvidaste tu contraseña?</a>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
