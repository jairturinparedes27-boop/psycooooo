const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 🔹 Obtener alumnos de un curso
router.get("/:course_id", async (req, res) => {
  try {
    const { course_id } = req.params;
    const [rows] = await db.query(
      `SELECT a.dni, a.nombre, a.apellido
       FROM alumno_curso ac
       JOIN alumnos a ON a.dni = ac.alumno_dni
       WHERE ac.course_id = ?`,
      [course_id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error obteniendo alumnos del curso:", err);
    res.status(500).json({ error: "Error obteniendo alumnos del curso" });
  }
});

// 🔹 Agregar alumno a un curso (validando que exista en alumnos)
router.post("/", async (req, res) => {
  try {
    const { alumno_dni, course_id, ciclo } = req.body;

    // Validar que el alumno exista
    const [alumno] = await db.query("SELECT * FROM alumnos WHERE dni = ?", [alumno_dni]);
    if (alumno.length === 0) {
      return res.status(404).json({ error: "El alumno no existe" });
    }

    // Validar que el curso exista
    const [curso] = await db.query("SELECT * FROM courses WHERE id = ?", [course_id]);
    if (curso.length === 0) {
      return res.status(404).json({ error: "El curso no existe" });
    }

    // Insertar relación
    await db.query(
      "INSERT INTO alumno_curso (alumno_dni, course_id, ciclo) VALUES (?, ?, ?)",
      [alumno_dni, course_id, ciclo]
    );

    res.json({ message: "Alumno agregado al curso" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "El alumno ya está inscrito en este curso y ciclo" });
    }
    console.error("Error agregando alumno:", err);
    res.status(500).json({ error: "Error agregando alumno" });
  }
});

// 🔹 Eliminar alumno de un curso
router.delete("/", async (req, res) => {
  try {
    const { alumno_dni, course_id } = req.body;
    const [result] = await db.query(
      "DELETE FROM alumno_curso WHERE alumno_dni = ? AND course_id = ?",
      [alumno_dni, course_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Alumno no encontrado en este curso" });
    }

    res.json({ message: "Alumno eliminado del curso" });
  } catch (err) {
    console.error("Error eliminando alumno:", err);
    res.status(500).json({ error: "Error eliminando alumno" });
  }
});

module.exports = router;
