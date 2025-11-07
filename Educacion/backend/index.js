const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const alumnoRoutes = require('./routes/alumno');
const profesorRoutes = require('./routes/profesor');
const carreraRoutes = require('./routes/carrera');
const cursosRoutes = require('./routes/cursos');
const cicloRoutes = require('./routes/ciclos');
const cursosCicloRoutes = require('./routes/cursosCiclo');
const alumnocursosRoutes = require('./routes/alumnocursos');

// Validación de carga de rutas
console.log('Alumno routes:', alumnoRoutes ? 'OK' : 'Error');
console.log('Profesor routes:', profesorRoutes ? 'OK' : 'Error');
console.log('Carrera routes:', carreraRoutes ? 'OK' : 'Error');
console.log('Cursos routes:', cursosRoutes ? 'OK' : 'Error');
console.log('Ciclos routes:', cicloRoutes ? 'OK' : 'Error');
console.log('CursosCiclo routes:', cursosCicloRoutes ? 'OK' : 'Error');
console.log('AlumnoCursos routes:', alumnocursosRoutes ? 'OK' : 'Error');

// Registro de rutas
app.use('/api/alumno', alumnoRoutes);
app.use('/api/profesor', profesorRoutes);
app.use('/api/carrera', carreraRoutes);
app.use('/api/curso', cursosRoutes);
app.use('/api/ciclo', cicloRoutes);
app.use('/api/curso-ciclo', cursosCicloRoutes);
app.use('/api/alumno-curso', alumnocursosRoutes);

// Puerto
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});