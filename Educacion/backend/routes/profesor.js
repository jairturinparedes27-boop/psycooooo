const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 🔹 Registrar profesor y credenciales con validación de duplicados
router.post('/', async (req, res) => {
  const { dni, nombre, apellido, especialidad, email, telefono } = req.body;
  const usuario = `p${dni}`;
  const contraseña = dni;

  try {
    // Verificar si ya existe algún dato duplicado
    const [existente] = await db.query(
      'SELECT dni, telefono, email FROM profesores WHERE dni = ? OR telefono = ? OR email = ?',
      [dni, telefono, email]
    );

    if (existente.length > 0) {
      const conflictos = [];
      if (existente[0].dni === dni) conflictos.push('DNI ya registrado por otra persona');
      if (existente[0].telefono === telefono) conflictos.push('Teléfono ya registrado por otra persona');
      if (existente[0].email === email) conflictos.push('Correo ya registrado por otra persona');
      return res.status(409).json({ conflictos });
    }

    // Insertar profesor
    await db.query(
      'INSERT INTO profesores (dni, nombre, apellido, especialidad, email, telefono) VALUES (?, ?, ?, ?, ?, ?)',
      [dni, nombre, apellido, especialidad, email, telefono]
    );

    // Insertar credenciales
    await db.query(
      'INSERT INTO credenciales (usuario, contraseña, tipo, dni) VALUES (?, ?, ?, ?)',
      [usuario, contraseña, 'profesor', dni]
    );

    res.status(201).json({ message: 'Profesor y usuario creados correctamente' });
  } catch (err) {
    console.error('Error al registrar profesor:', err);
    res.status(500).json({ error: 'Error al registrar profesor o usuario' });
  }
});

// 🔹 Listar todos los profesores
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM profesores');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener profesores:', err);
    res.status(500).json({ error: 'Error al obtener profesores' });
  }
});

// 🔹 Buscar profesor por DNI
router.get('/:dni', async (req, res) => {
  const { dni } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM profesores WHERE dni = ?', [dni]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Profesor no encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error al buscar profesor:', err);
    res.status(500).json({ error: 'Error al buscar profesor' });
  }
});

// 🔹 Actualizar profesor por DNI
router.put('/:dni', async (req, res) => {
  const { dni } = req.params;
  const { nombre, apellido, especialidad, email, telefono } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE profesores SET nombre = ?, apellido = ?, especialidad = ?, email = ?, telefono = ? WHERE dni = ?',
      [nombre, apellido, especialidad, email, telefono, dni]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Profesor no encontrado' });
    }

    res.json({ message: 'Profesor actualizado correctamente' });
  } catch (err) {
    console.error('Error al actualizar profesor:', err);
    res.status(500).json({ error: 'Error al actualizar profesor' });
  }
});

// 🔹 Eliminar profesor y credenciales por DNI
router.delete('/:dni', async (req, res) => {
  const { dni } = req.params;

  try {
    await db.query('DELETE FROM credenciales WHERE dni = ?', [dni]);
    const [result] = await db.query('DELETE FROM profesores WHERE dni = ?', [dni]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Profesor no encontrado' });
    }

    res.json({ message: 'Profesor y credenciales eliminados correctamente' });
  } catch (err) {
    console.error('Error al eliminar profesor:', err);
    res.status(500).json({ error: 'Error al eliminar profesor' });
  }
});

module.exports = router;