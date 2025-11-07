import { useState, useEffect } from 'react';
import axios from 'axios';
import './GestorCarrerasCursos.css';

export default function GestorCarreras() {
  const [carreras, setCarreras] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [expandedCarrera, setExpandedCarrera] = useState(null);
  const [ciclosPorCarrera, setCiclosPorCarrera] = useState({});
  const [cursosPorCiclo, setCursosPorCiclo] = useState({});
  const [nuevoCiclo, setNuevoCiclo] = useState('');
  const [cursoAsignar, setCursoAsignar] = useState({});

  useEffect(() => {
    axios.get('http://localhost:3001/api/carrera').then(res => setCarreras(res.data));
    axios.get('http://localhost:3001/api/curso').then(res => setCursos(res.data));
  }, []);

  const recargarCarrera = async carreraId => {
    const res = await axios.get(`http://localhost:3001/api/ciclo?carreraId=${carreraId}`);
    setCiclosPorCarrera(prev => ({ ...prev, [carreraId]: res.data }));

    const cursosMap = {};
    for (const ciclo of res.data) {
      const r = await axios.get(`http://localhost:3001/api/curso-ciclo/${ciclo.id}`);
      cursosMap[ciclo.id] = r.data;
    }
    setCursosPorCiclo(cursosMap);
  };

  const toggleCarrera = async carreraId => {
    if (expandedCarrera === carreraId) {
      setExpandedCarrera(null);
    } else {
      setExpandedCarrera(carreraId);
      await recargarCarrera(carreraId);
    }
  };

  const agregarCiclo = async carreraId => {
    if (!nuevoCiclo) return;
    await axios.post('http://localhost:3001/api/ciclo', {
      nombre: nuevoCiclo,
      carreras_id: carreraId
    });
    setNuevoCiclo('');
    await recargarCarrera(carreraId);
  };

  const asignarCurso = async cicloId => {
    const cursoId = cursoAsignar[cicloId];
    if (!cursoId) return;
    await axios.post('http://localhost:3001/api/curso-ciclo', {
      cursos_id: cursoId,
      ciclos_id: cicloId
    });
    setCursoAsignar(prev => ({ ...prev, [cicloId]: '' }));
    await recargarCarrera(expandedCarrera);
  };

  const eliminarCiclo = async cicloId => {
    if (!window.confirm('¿Eliminar este ciclo?')) return;
    try {
      await axios.delete(`http://localhost:3001/api/ciclo/${cicloId}`);
      await recargarCarrera(expandedCarrera);
    } catch (err) {
      alert('Error al eliminar ciclo');
    }
  };

  const eliminarCursoDeCiclo = async (cursoId, cicloId) => {
    if (!window.confirm('¿Eliminar este curso del ciclo?')) return;
    try {
      await axios.delete(`http://localhost:3001/api/curso-ciclo`, {
        data: { cursos_id: cursoId, ciclos_id: cicloId }
      });
      await recargarCarrera(expandedCarrera);
    } catch (err) {
      alert('Error al eliminar curso del ciclo');
    }
  };

  return (
    <div className="gestor-container">
      <h2>Gestión de Carreras, Ciclos y Cursos</h2>

      {carreras.map(carrera => (
        <div key={carrera.id} className="carrera-box">
          <div className="carrera-header">
            <button className="toggle-btn" onClick={() => toggleCarrera(carrera.id)}>
              {expandedCarrera === carrera.id ? '⬆️' : '⬇️'}
            </button>
            <span className="carrera-nombre">{carrera.nombre}</span>
            {expandedCarrera === carrera.id && (
              <>
                <input
                  className="input-ciclo"
                  placeholder="Nuevo ciclo"
                  value={nuevoCiclo}
                  onChange={e => setNuevoCiclo(e.target.value)}
                />
                <button className="btn-ciclo" onClick={() => agregarCiclo(carrera.id)}>+ Añadir Ciclo</button>
              </>
            )}
          </div>

          {expandedCarrera === carrera.id && (
            <div className="ciclos-list">
              {(ciclosPorCarrera[carrera.id] || []).map(ciclo => {
                const cursosAsignados = cursosPorCiclo[ciclo.id] || [];
                const cursosDisponibles = cursos.filter(
                  c => !cursosAsignados.some(asignado => asignado.id === c.id)
                );

                return (
                  <div key={ciclo.id} className="ciclo-box">
                    <div className="ciclo-header">
                      <h3>{ciclo.nombre}</h3>
                      <button className="btn-eliminar-ciclo" onClick={() => eliminarCiclo(ciclo.id)}>🗑 Eliminar Ciclo</button>
                    </div>

                    <ul className="curso-list">
                      {cursosAsignados.map(curso => (
                        <li key={curso.id}>
                          {curso.name} ({curso.code})
                          <button
                            className="btn-eliminar-curso"
                            onClick={() => eliminarCursoDeCiclo(curso.id, ciclo.id)}
                          >
                            eliminar
                          </button>
                        </li>
                      ))}
                    </ul>

                    <div className="asignar-curso">
                      <select
                        value={cursoAsignar[ciclo.id] || ''}
                        onChange={e => setCursoAsignar(prev => ({ ...prev, [ciclo.id]: e.target.value }))}
                      >
                        <option value="">Selecciona un curso</option>
                        {cursosDisponibles.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      <button className="btn-curso" onClick={() => asignarCurso(ciclo.id)}>+ Añadir Curso</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}