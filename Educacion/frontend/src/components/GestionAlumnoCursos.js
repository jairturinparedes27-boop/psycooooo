import { useEffect, useState } from "react";
import axios from "axios";
import "./GestionAlumnoCurs.css"; // 👈 Importa el CSS

export default function GestionAlumnoCursos() {
  const [estructura, setEstructura] = useState([]);
  const [alumnosCurso, setAlumnosCurso] = useState({});
  const [nuevoAlumnoDni, setNuevoAlumnoDni] = useState("");
  const [mensajeError, setMensajeError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3001/api/estructura")
      .then(res => setEstructura(res.data))
      .catch(err => console.error("Error cargando estructura:", err));
  }, []);

  const cargarAlumnos = async (course_id) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/alumnocursos/${course_id}`);
      setAlumnosCurso(prev => ({ ...prev, [course_id]: res.data }));
    } catch (err) {
      console.error("Error cargando alumnos:", err);
    }
  };

  const agregarAlumno = async (course_id, ciclo) => {
    if (!nuevoAlumnoDni) return setMensajeError("Ingresa el DNI del alumno");
    try {
      await axios.post("http://localhost:3001/api/alumnocursos", {
        alumno_dni: nuevoAlumnoDni,
        course_id,
        ciclo
      });
      setNuevoAlumnoDni("");
      cargarAlumnos(course_id);
    } catch (err) {
      console.error("Error agregando alumno:", err);
      setMensajeError(err.response?.data?.error || "Error al agregar alumno");
    }
  };

  const eliminarAlumno = async (dni, course_id) => {
    if (!window.confirm("¿Eliminar este alumno del curso?")) return;
    try {
      await axios.delete("http://localhost:3001/api/alumnocursos", {
        data: { alumno_dni: dni, course_id }
      });
      cargarAlumnos(course_id);
    } catch (err) {
      console.error("Error eliminando alumno:", err);
      setMensajeError("Error al eliminar alumno");
    }
  };

  return (
    <div className="container">
      <h2 className="title">📚 Vista Académica por Carrera, Ciclo y Curso</h2>

      {mensajeError && <div className="alert">{mensajeError}</div>}

      {estructura.length === 0 ? (
        <p>No hay datos disponibles</p>
      ) : (
        estructura.map((carrera) => (
          <div key={carrera.nombre} className="card">
            <h3 className="card-title">{carrera.nombre}</h3>
            {carrera.ciclos.map((ciclo) => (
              <div key={ciclo.nombre} className="ciclo">
                <h4>{ciclo.nombre}</h4>
                {ciclo.cursos.map((curso) => (
                  <div key={curso.id} className="curso">
                    <strong>{curso.nombre}</strong>
                    <button className="btn btn-secondary" onClick={() => cargarAlumnos(curso.id)}>
                      Mostrar alumnos
                    </button>

                    <div className="form">
                      <input
                        type="text"
                        placeholder="DNI alumno"
                        value={nuevoAlumnoDni}
                        onChange={(e) => setNuevoAlumnoDni(e.target.value)}
                        className="input"
                      />
                      <button className="btn btn-primary" onClick={() => agregarAlumno(curso.id, ciclo.nombre)}>
                        Agregar alumno
                      </button>
                    </div>

                    <div className="alumnos">
                      {alumnosCurso[curso.id]?.map((al) => (
                        <div key={al.dni} className="alumno">
                          {al.nombre} {al.apellido} ({al.dni})
                          <button className="btn btn-danger" onClick={() => eliminarAlumno(al.dni, curso.id)}>
                            Eliminar
                          </button>
                        </div>
                      ))}
                    </div>
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
