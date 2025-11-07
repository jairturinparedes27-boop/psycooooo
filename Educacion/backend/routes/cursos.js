const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 🔹 Crear curso con validación de duplicados
router.post('/', async (req, res) => {
  const { code, name, credits } = req.body;

  if (!code || !name || !credits) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }

  try {
    const [existe] = await db.execute(
      'SELECT code, name FROM courses WHERE code = ? OR LOWER(name) = ?',
      [code, name.trim().toLowerCase()]
    );

    if (existe.length > 0) {
      const conflictos = [];
      if (existe[0].code === code) conflictos.push('Código ya registrado');
      if (existe[0].name.toLowerCase() === name.trim().toLowerCase()) conflictos.push('Nombre ya registrado');
      return res.status(409).json({ conflictos });
    }

    const [result] = await db.execute(
      'INSERT INTO courses (code, name, credits) VALUES (?, ?, ?)',
      [code, name.trim(), credits]
    );

    res.status(201).json({ message: 'Curso creado', courseId: result.insertId });
  } catch (err) {
    console.error('Error al insertar curso:', err);
    res.status(500).json({ message: 'Error al crear curso' });
  }
});

// 🔹 Obtener todos los cursos
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM courses');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener cursos:', err);
    res.status(500).json({ message: 'Error al obtener cursos' });
  }
});

// 🔹 Buscar curso por código
router.get('/:code', async (req, res) => {
  const { code } = req.params;

  try {
    const [rows] = await db.execute('SELECT * FROM courses WHERE code = ?', [code]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error al buscar curso:', err);
    res.status(500).json({ message: 'Error al buscar curso' });
  }
});

// 🔹 Actualizar curso por ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { code, name, credits } = req.body;

  try {
    const [result] = await db.execute(
      'UPDATE courses SET code = ?, name = ?, credits = ? WHERE id = ?',
      [code, name, credits, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }

    res.json({ message: 'Curso actualizado correctamente' });
  } catch (err) {
    console.error('Error al actualizar curso:', err);
    res.status(500).json({ message: 'Error al actualizar curso' });
  }
});

// 🔹 Eliminar curso por ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute('DELETE FROM courses WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }

    res.json({ message: 'Curso eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar curso:', err);
    res.status(500).json({ message: 'Error al eliminar curso' });
  }
});

module.exports = router;