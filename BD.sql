CREATE DATABASE educacion;
drop database educacion;

USE educacion;

CREATE TABLE alumnos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  apellido VARCHAR(100),
  fecha_nac DATE,
  telefono VARCHAR(9),
  correo VARCHAR(100) UNIQUE,
  carrera VARCHAR(100)
);
ALTER TABLE alumnos ADD COLUMN dni VARCHAR(8) UNIQUE NOT NULL;

CREATE TABLE profesores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  apellido VARCHAR(100),
  especialidad VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  telefono VARCHAR(20)
);
ALTER TABLE profesores ADD COLUMN dni VARCHAR(20) UNIQUE NOT NULL;

CREATE TABLE credenciales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(50) UNIQUE NOT NULL,
  contraseña VARCHAR(255) NOT NULL,
  tipo ENUM('alumno', 'profesor') NOT NULL,
  dni VARCHAR(20) NOT NULL
);

CREATE TABLE carreras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT
);

CREATE TABLE courses  (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  credits INT NOT NULL
);

CREATE TABLE ciclos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  carreras_id INT NOT NULL,
  FOREIGN KEY (carreras_id) REFERENCES carreras(id) ON DELETE CASCADE
);
CREATE TABLE curso_ciclo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cursos_id INT NOT NULL,
  ciclos_id INT NOT NULL,
  FOREIGN KEY (cursos_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (ciclos_id) REFERENCES ciclos(id) ON DELETE CASCADE,
  UNIQUE (cursos_id, ciclos_id)
);

CREATE TABLE alumno_curso (
  id INT AUTO_INCREMENT PRIMARY KEY,
  alumno_dni VARCHAR(8) NOT NULL,
  course_id INT NOT NULL,
  ciclo VARCHAR(10) NOT NULL,
  FOREIGN KEY (alumno_dni) REFERENCES alumnos(dni),
  FOREIGN KEY (course_id) REFERENCES courses(id),
  UNIQUE (alumno_dni, course_id, ciclo)
);

SHOW TABLES;
select*from alumnos;
select*from profesores;
select*from credenciales;
select*from carreras;
select*from courses;
select*from carrera_curso;
select*from ciclos;
select*from curso_ciclo;

drop table carrera_curso;
