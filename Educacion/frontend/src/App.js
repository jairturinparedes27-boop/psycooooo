import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RegistroAlumno from './components/RegistroAlumno';
import RegistroProfesor from './components/RegistroProfesor';
import RegistroCurso from './components/RegistroCurso';
import RegistroCarrera from './components/RegistroCarrera';
import GestorCarreras from './components/GestionCarreras';
import AlumnoCursos from './components/GestionAlumnoCursos';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/registro-alumno">Registrar Alumno</Link></li>
            <li><Link to="/registro-profesor">Registrar Profesor</Link></li>
            <li><Link to="/registro-carrera">Registrar Carrera</Link></li>
            <li><Link to="/registro-curso">Registrar Curso</Link></li>
            <li><Link to="/gestion-carrera">Gestión de Carreras</Link></li>
            <li><Link to="/gestion-alumnocursos">Gestión Alumnos y Cursos</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/registro-alumno" element={<RegistroAlumno />} />
          <Route path="/registro-profesor" element={<RegistroProfesor />} />
          <Route path="/registro-carrera" element={<RegistroCarrera />} />
          <Route path="/registro-curso" element={<RegistroCurso />} />
          <Route path="/gestion-carrera" element={<GestorCarreras />} />
          <Route path="/gestion-alumnocursos" element={<AlumnoCursos />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;