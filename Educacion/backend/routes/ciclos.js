const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 🔹 Obtener ciclos por carrera
router.get('/', async (req, res) => {
  const { carreraId } = req.query;
  if (!carreraId) return res.status(400).json({ message: 'Falta carreraId' });

  try {
    const [rows] = await db.execute(
      'SELECT * FROM ciclos WHERE carreras_id = ?',
      [carreraId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener ciclos:', err);
    res.status(500).json({ message: 'Error al obtener ciclos' });
  }
});

// 🔹 Crear ciclo
router.post('/', async (req, res) => {
  const { nombre, carreras_id } = req.body;
  if (!nombre || !carreras_id) return res.status(400).json({ message: 'Faltan campos' });

  try {
    const [result] = await db.execute(
      'INSERT INTO ciclos (nombre, carreras_id) VALUES (?, ?)',
      [nombre, carreras_id]
    );
    res.status(201).json({ message: 'Ciclo creado', cicloId: result.insertId });
  } catch (err) {
    console.error('Error al crear ciclo:', err);
    res.status(500).json({ message: 'Error al crear ciclo' });
  }
});

// 🔹 Eliminar ciclo
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM ciclos WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ciclo no encontrado' });
    }
    res.json({ message: 'Ciclo eliminado' });
  } catch (err) {
    console.error('Error al eliminar ciclo:', err);
    res.status(500).json({ message: 'Error al eliminar ciclo' });
  }
});

module.exports = router;