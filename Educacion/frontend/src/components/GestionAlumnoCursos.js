// src/components/GestionAlumnoCursos.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function GestionAlumnoCursos() {
  const [estructura, setEstructura] = useState([]); // carreras → ciclos → cursos
  const [alumnosCurso, setAlumnosCurso] = useState({}); // alumnos por curso
  const [nuevoAlumnoDni, setNuevoAlumnoDni] = useState("");

  // Traer la estructura de carreras, ciclos y cursos desde backend
  useEffect(() => {
    axios.get("http://localhost:3001/api/alumnocurso") // ruta que retorna la estructura jerárquica
      .then(res => setEstructura(res.data))
      .catch(err => console.error("Error cargando estructura:", err));
  }, []);

  // Traer alumnos de un curso específico
  const cargarAlumnos = async (course_id) => {
    try {
      const res = await axios.get(`http://localhost:3001/alumnocurso/${course_id}`);
      setAlumnosCurso(prev => ({ ...prev, [course_id]: res.data }));
    } catch (err) {
      console.error("Error cargando alumnos:", err);
    }
  };

  // Agregar alumno a un curso
  const agregarAlumno = async (course_id, ciclo) => {
    if (!nuevoAlumnoDni) return alert("Ingresa el DNI del alumno");
    try {
      await axios.post("http://localhost:3001/alumnocurso", {
        alumno_dni: nuevoAlumnoDni,
        course_id,
        ciclo
      });
      setNuevoAlumnoDni("");
      cargarAlumnos(course_id);
    } catch (err) {
      console.error("Error agregando alumno:", err);
      alert("Error al agregar alumno");
    }
  };

  // Eliminar alumno de un curso
  const eliminarAlumno = async (dni, course_id) => {
    if (!window.confirm("¿Eliminar este alumno del curso?")) return;
    try {
      await axios.delete("http://localhost:3001/alumnocurso", { data: { alumno_dni: dni, course_id } });
      cargarAlumnos(course_id);
    } catch (err) {
      console.error("Error eliminando alumno:", err);
      alert("Error al eliminar alumno");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>📚 Vista Académica por Carrera, Ciclo y Curso</h2>
      {estructura.length === 0 ? (
        <p>No hay datos disponibles</p>
      ) : (
        estructura.map((carrera) => (
          <div key={carrera.nombre} style={{ marginBottom: "20px" }}>
            <h3>{carrera.nombre}</h3>
            {carrera.ciclos.map((ciclo) => (
              <div key={ciclo.nombre} style={{ marginLeft: "20px", marginBottom: "10px" }}>
                <h4>{ciclo.nombre}</h4>
                {ciclo.cursos.map((curso) => (
                  <div key={curso.id} style={{ marginLeft: "20px", marginBottom: "5px" }}>
                    <strong>{curso.nombre}</strong>
                    <button
                      style={{ marginLeft: "10px" }}
                      onClick={() => cargarAlumnos(curso.id)}
                    >
                      Mostrar alumnos
                    </button>

                    <div style={{ marginTop: "5px" }}>
                      <input
                        type="text"
                        placeholder="DNI alumno"
                        value={nuevoAlumnoDni}
                        onChange={(e) => setNuevoAlumnoDni(e.target.value)}
                        style={{ marginRight: "5px" }}
                      />
                      <button onClick={() => agregarAlumno(curso.id, ciclo.nombre)}>
                        Agregar alumno
                      </button>
                    </div>

                    {alumnosCurso[curso.id]?.map((al) => (
                      <div key={al.dni} style={{ marginLeft: "25px" }}>
                        {al.nombre} {al.apellido} ({al.dni})
                        <button
                          onClick={() => eliminarAlumno(al.dni, curso.id)}
                          style={{ marginLeft: "10px", color: "red" }}
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}

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
