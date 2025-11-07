const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 🔹 Crear carrera con validación de duplicados (insensible a mayúsculas)
router.post('/', async (req, res) => {
  const { nombre, descripcion } = req.body;

  if (!nombre || !descripcion) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }

  try {
    const nombreNormalizado = nombre.trim().toLowerCase();

    const [existe] = await db.execute(
      'SELECT * FROM carreras WHERE LOWER(nombre) = ?',
      [nombreNormalizado]
    );

    if (existe.length > 0) {
      return res.status(409).json({ message: 'La carrera ya está registrada' });
    }

    const [result] = await db.execute(
      'INSERT INTO carreras (nombre, descripcion) VALUES (?, ?)',
      [nombre.trim(), descripcion]
    );

    res.status(201).json({ message: 'Carrera creada', carreraId: result.insertId });
  } catch (err) {
    console.error('Error al crear carrera:', err);
    res.status(500).json({ message: 'Error al crear carrera' });
  }
});

// 🔹 Obtener todas las carreras
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM carreras');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener carreras:', err);
    res.status(500).json({ message: 'Error al obtener carreras' });
  }
});

// 🔹 Buscar carrera por nombre
router.get('/:nombre', async (req, res) => {
  const { nombre } = req.params;

  try {
    const [rows] = await db.execute(
      'SELECT * FROM carreras WHERE LOWER(nombre) = ?',
      [nombre.toLowerCase()]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Carrera no encontrada' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error al buscar carrera:', err);
    res.status(500).json({ message: 'Error al buscar carrera' });
  }
});

// 🔹 Actualizar carrera por ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;

  try {
    const [result] = await db.execute(
      'UPDATE carreras SET nombre = ?, descripcion = ? WHERE id = ?',
      [nombre, descripcion, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Carrera no encontrada' });
    }

    res.json({ message: 'Carrera actualizada correctamente' });
  } catch (err) {
    console.error('Error al actualizar carrera:', err);
    res.status(500).json({ message: 'Error al actualizar carrera' });
  }
});

// 🔹 Eliminar carrera por ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute('DELETE FROM carreras WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Carrera no encontrada' });
    }

    res.json({ message: 'Carrera eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar carrera:', err);
    res.status(500).json({ message: 'Error al eliminar carrera' });
  }
});

module.exports = router;