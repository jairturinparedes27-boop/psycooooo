const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 🔹 Obtener cursos por ciclo
router.get('/:cicloId', async (req, res) => {
  const { cicloId } = req.params;
  try {
    const [rows] = await db.execute(
      `SELECT c.id, c.code, c.name 
       FROM courses c
       JOIN curso_ciclo cc ON c.id = cc.cursos_id
       WHERE cc.ciclos_id = ?`,
      [cicloId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener cursos del ciclo:', err);
    res.status(500).json({ message: 'Error al obtener cursos' });
  }
});

// 🔹 Asignar curso a ciclo
router.post('/', async (req, res) => {
  const { cursos_id, ciclos_id } = req.body;
  if (!cursos_id || !ciclos_id) return res.status(400).json({ message: 'Faltan campos' });

  try {
    await db.execute(
      'INSERT INTO curso_ciclo (cursos_id, ciclos_id) VALUES (?, ?)',
      [cursos_id, ciclos_id]
    );
    res.status(201).json({ message: 'Curso asignado al ciclo' });
  } catch (err) {
    console.error('Error al asignar curso:', err);
    res.status(500).json({ message: 'Error al asignar curso' });
  }
});

// 🔹 Eliminar curso de ciclo
router.delete('/', async (req, res) => {
  const { cursos_id, ciclos_id } = req.body;
  if (!cursos_id || !ciclos_id) return res.status(400).json({ message: 'Faltan campos' });

  try {
    const [result] = await db.execute(
      'DELETE FROM curso_ciclo WHERE cursos_id = ? AND ciclos_id = ?',
      [cursos_id, ciclos_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Curso no asignado a ese ciclo' });
    }
    res.json({ message: 'Curso eliminado del ciclo' });
  } catch (err) {
    console.error('Error al eliminar curso del ciclo:', err);
    res.status(500).json({ message: 'Error al eliminar curso del ciclo' });
  }
});

module.exports = router;