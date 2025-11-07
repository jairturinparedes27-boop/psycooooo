// src/routes.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistroUsuario from './components/RegistroUsuario';
import RegistroCurso from './components/RegistroCurso';
import Login from './components/Login';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro-usuario" element={<RegistroUsuario />} />
        <Route path="/registro-curso" element={<RegistroCurso />} />
      </Routes>
    </Router>
  );
}