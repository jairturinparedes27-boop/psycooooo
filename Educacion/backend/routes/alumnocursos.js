const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/alumno-curso → estructura jerárquica
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        ca.nombre AS carrera,
        ac.ciclo,
        co.id AS curso_id,
        co.name AS curso,
        al.dni,
        al.nombre AS alumno_nombre,
        al.apellido AS alumno_apellido
      FROM alumno_curso ac
      JOIN alumnos al ON ac.alumno_dni = al.dni
      JOIN courses co ON ac.course_id = co.id
      JOIN carreras ca ON al.carrera_id = ca.id
      ORDER BY ca.nombre, ac.ciclo, co.name, al.apellido
    `);

    const estructura = [];

    for (const row of rows) {
      let carrera = estructura.find(c => c.carrera === row.carrera);
      if (!carrera) {
        carrera = { carrera: row.carrera, ciclos: [] };
        estructura.push(carrera);
      }

      let ciclo = carrera.ciclos.find(ci => ci.ciclo === row.ciclo);
      if (!ciclo) {
        ciclo = { ciclo: row.ciclo, cursos: [] };
        carrera.ciclos.push(ciclo);
      }

      let curso = ciclo.cursos.find(cu => cu.curso === row.curso);
      if (!curso) {
        curso = { curso: row.curso, curso_id: row.curso_id, alumnos: [] };
        ciclo.cursos.push(curso);
      }

      curso.alumnos.push({
        dni: row.dni,
        nombre: row.alumno_nombre,
        apellido: row.alumno_apellido
      });
    }

    res.json(estructura);
  } catch (err) {
    console.error('Error al obtener estructura académica:', err);
    res.status(500).json({ message: 'Error al obtener estructura académica' });
  }
});

// POST /api/alumno-curso → inscribir alumno
router.post('/', async (req, res) => {
  const { alumno_dni, curso_id, ciclo } = req.body;
  try {
    const [exists] = await db.query(
      'SELECT * FROM alumno_curso WHERE alumno_dni = ? AND course_id = ? AND ciclo = ?',
      [alumno_dni, curso_id, ciclo]
    );

    if (exists.length > 0) {
      return res.status(409).json({ error: 'Alumno ya inscrito en este curso y ciclo' });
    }

    await db.query('INSERT INTO alumno_curso SET ?', {
      alumno_dni,
      course_id: curso_id,
      ciclo
    });

    res.status(201).json({ message: 'Alumno inscrito correctamente' });
  } catch (err) {
    console.error('Error al inscribir alumno:', err);
    res.status(500).json({ error: 'Error al inscribir alumno' });
  }
});

// DELETE /api/alumno-curso → eliminar inscripción específica
router.delete('/', async (req, res) => {
  const { alumno_dni, curso_id, ciclo } = req.body;
  try {
    const [result] = await db.query(
      'DELETE FROM alumno_curso WHERE alumno_dni = ? AND course_id = ? AND ciclo = ?',
      [alumno_dni, curso_id, ciclo]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Inscripción no encontrada' });
    }

    res.json({ message: 'Inscripción eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar inscripción:', err);
    res.status(500).json({ error: 'Error al eliminar inscripción' });
  }
});

module.exports = router;