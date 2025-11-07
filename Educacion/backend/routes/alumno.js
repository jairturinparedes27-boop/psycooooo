const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 🔹 Registrar alumno y credenciales con validación de duplicados
router.post('/', async (req, res) => {
  const { dni, nombre, apellido, fecha_nac, telefono, correo, carrera } = req.body;
  const usuario = `a${dni}`;
  const contraseña = dni;

  try {
    // Verificar si ya existe algún dato duplicado
    const [existente] = await db.query(
      'SELECT dni, telefono, correo FROM alumnos WHERE dni = ? OR telefono = ? OR correo = ?',
      [dni, telefono, correo]
    );

    if (existente.length > 0) {
      const conflictos = [];
      if (existente[0].dni === dni) conflictos.push('DNI ya registrado por otra persona');
      if (existente[0].telefono === telefono) conflictos.push('Teléfono ya registrado por otra persona');
      if (existente[0].correo === correo) conflictos.push('Correo ya registrado por otra persona');
      return res.status(409).json({ conflictos });
    }

    // Insertar alumno
    await db.query(
      'INSERT INTO alumnos (dni, nombre, apellido, fecha_nac, telefono, correo, carrera) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [dni, nombre, apellido, fecha_nac, telefono, correo, carrera]
    );

    // Insertar credenciales
    await db.query(
      'INSERT INTO credenciales (usuario, contraseña, tipo, dni) VALUES (?, ?, ?, ?)',
      [usuario, contraseña, 'alumno', dni]
    );

    res.status(201).json({ message: 'Alumno y usuario creados correctamente' });
  } catch (err) {
    console.error('Error al registrar alumno:', err);
    res.status(500).json({ error: 'Error al registrar alumno o usuario' });
  }
});

// 🔹 Listar todos los alumnos
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM alumnos');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener alumnos:', err);
    res.status(500).json({ error: 'Error al obtener alumnos' });
  }
});

// 🔹 Buscar alumno por DNI
router.get('/:dni', async (req, res) => {
  const { dni } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM alumnos WHERE dni = ?', [dni]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error al buscar alumno:', err);
    res.status(500).json({ error: 'Error al buscar alumno' });
  }
});

// 🔹 Actualizar alumno por DNI
router.put('/:dni', async (req, res) => {
  const { dni } = req.params;
  const { nombre, apellido, fecha_nac, telefono, correo, carrera } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE alumnos SET nombre = ?, apellido = ?, fecha_nac = ?, telefono = ?, correo = ?, carrera = ? WHERE dni = ?',
      [nombre, apellido, fecha_nac, telefono, correo, carrera, dni]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }

    res.json({ message: 'Alumno actualizado correctamente' });
  } catch (err) {
    console.error('Error al actualizar alumno:', err);
    res.status(500).json({ error: 'Error al actualizar alumno' });
  }
});

// 🔹 Eliminar alumno y credenciales por DNI
router.delete('/:dni', async (req, res) => {
  const { dni } = req.params;

  try {
    await db.query('DELETE FROM credenciales WHERE dni = ?', [dni]);
    const [result] = await db.query('DELETE FROM alumnos WHERE dni = ?', [dni]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }

    res.json({ message: 'Alumno y credenciales eliminados correctamente' });
  } catch (err) {
    console.error('Error al eliminar alumno:', err);
    res.status(500).json({ error: 'Error al eliminar alumno' });
  }
});

module.exports = router;
