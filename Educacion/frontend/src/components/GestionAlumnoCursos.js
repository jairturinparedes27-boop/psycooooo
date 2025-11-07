import { useState, useEffect } from 'react';
import axios from 'axios';

export default function VistaAcademica() {
  const [estructura, setEstructura] = useState([]);
  const [expandedCarreras, setExpandedCarreras] = useState({});
  const [expandedCiclos, setExpandedCiclos] = useState({});
  const [expandedCursos, setExpandedCursos] = useState({});

  useEffect(() => {
    fetchEstructura();
  }, []);

  const fetchEstructura = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/alumno-curso');
      setEstructura(res.data);
    } catch (err) {
      alert('Error al cargar estructura académica');
    }
  };

  const toggleCarrera = nombre => {
    setExpandedCarreras(prev => ({ ...prev, [nombre]: !prev[nombre] }));
  };

  const toggleCiclo = nombre => {
    setExpandedCiclos(prev => ({ ...prev, [nombre]: !prev[nombre] }));
  };

  const toggleCurso = nombre => {
    setExpandedCursos(prev => ({ ...prev, [nombre]: !prev[nombre] }));
  };

  const handleEliminarAlumno = async dni => {
    if (!window.confirm('¿Eliminar este alumno del curso?')) return;
    try {
      await axios.delete(`http://localhost:3001/api/alumno/${dni}`);
      fetchEstructura();
    } catch (err) {
      alert('Error al eliminar alumno');
    }
  };

  const handleAñadirAlumno = curso => {
    alert(`Añadir alumno a ${curso}`);
    // Aquí podrías abrir un modal o redirigir a un formulario
  };

  return (
    <div className="gestor-container" style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>📚 Vista Académica por Carrera, Ciclo y Curso</h2>
      {estructura.length === 0 ? (
        <p>No hay datos disponibles.</p>
      ) : (
        estructura.map(carrera => (
          <div key={carrera.carrera} style={{ marginBottom: '20px' }}>
            <button onClick={() => toggleCarrera(carrera.carrera)} style={{ fontWeight: 'bold' }}>
              ▶ {carrera.carrera}
            </button>
            {expandedCarreras[carrera.carrera] &&
              carrera.ciclos.map(ciclo => (
                <div key={ciclo.ciclo} style={{ marginLeft: '20px' }}>
                  <button onClick={() => toggleCiclo(ciclo.ciclo)} style={{ fontWeight: 'bold' }}>
                    └─ {ciclo.ciclo}
                  </button>
                  {expandedCiclos[ciclo.ciclo] &&
                    ciclo.cursos.map(curso => (
                      <div key={curso.curso} style={{ marginLeft: '40px' }}>
                        <button onClick={() => toggleCurso(curso.curso)} style={{ fontWeight: 'bold' }}>
                          ├─ Curso: {curso.curso}
                        </button>
                        <button
                          onClick={() => handleAñadirAlumno(curso.curso)}
                          style={{
                            marginLeft: '10px',
                            backgroundColor: '#3498db',
                            color: 'white',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Añadir alumno
                        </button>
                        {expandedCursos[curso.curso] && (
                          <div style={{ marginLeft: '20px' }}>
                            {curso.alumnos.length === 0 ? (
                              <p>Sin alumnos registrados.</p>
                            ) : (
                              curso.alumnos.map(alumno => (
                                <div key={alumno.dni} style={{ marginBottom: '5px' }}>
                                  └─ {alumno.nombre} {alumno.apellido} ({alumno.dni})
                                  <button
                                    onClick={() => handleEliminarAlumno(alumno.dni)}
                                    style={{
                                      marginLeft: '10px',
                                      backgroundColor: '#e74c3c',
                                      color: 'white',
                                      border: 'none',
                                      padding: '4px 8px',
                                      borderRadius: '4px',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ))}
          </div>
        ))
      )}
    </div>
  );
}