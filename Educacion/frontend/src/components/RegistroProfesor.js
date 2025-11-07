import { useState, useEffect } from 'react';
import axios from 'axios';
import './GestorAlumnos.css'; // Puedes renombrar si quieres separar estilos

export default function GestorProfesores() {
  const [form, setForm] = useState({
    id: '',
    dni: '',
    nombre: '',
    apellido: '',
    especialidad: '',
    email: '',
    telefono: ''
  });

  const [profesores, setProfesores] = useState([]);
  const [searchDni, setSearchDni] = useState('');

  useEffect(() => {
    fetchProfesores();
  }, []);

  const fetchProfesores = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/profesor');
      setProfesores(res.data);
    } catch (err) {
      alert('Error al cargar profesores');
    }
  };

  const handleSearch = async () => {
    if (!/^\d{8}$/.test(searchDni)) {
      alert('El DNI debe tener exactamente 8 dígitos numéricos');
      return;
    }

    try {
      const res = await axios.get(`http://localhost:3001/api/profesor/${searchDni}`);
      setProfesores([res.data]);
    } catch (err) {
      alert('Profesor no encontrado');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!/^\d{8}$/.test(form.dni)) {
      alert('El DNI debe tener exactamente 8 dígitos numéricos');
      return;
    }

    if (!/^\d{9}$/.test(form.telefono)) {
      alert('El teléfono debe tener exactamente 9 dígitos numéricos');
      return;
    }

    try {
      if (form.id) {
        await axios.put(`http://localhost:3001/api/profesor/${form.dni}`, form);
        alert('Profesor actualizado');
      } else {
        await axios.post('http://localhost:3001/api/profesor', form);
        alert('Profesor registrado');
      }

      setForm({
        id: '',
        dni: '',
        nombre: '',
        apellido: '',
        especialidad: '',
        email: '',
        telefono: ''
      });

      fetchProfesores();
    } catch (err) {
      if (err.response?.status === 409 && err.response.data?.conflictos) {
        alert(err.response.data.conflictos.join('\n'));
      } else {
        alert('Error al guardar profesor');
      }
    }
  };

  const handleDelete = async dni => {
    if (!window.confirm('¿Eliminar este profesor?')) return;
    try {
      await axios.delete(`http://localhost:3001/api/profesor/${dni}`);
      fetchProfesores();
    } catch (err) {
      alert('Error al eliminar profesor');
    }
  };

  const handleEdit = profesor => {
    setForm(profesor);
  };

  return (
    <div className="gestor-container">
      <h2>Gestión de Profesores</h2>

      <div className="busqueda">
        <input
          type="text"
          placeholder="Buscar por DNI"
          value={searchDni}
          onChange={e => {
            const valor = e.target.value;
            if (/^\d{0,8}$/.test(valor)) {
              setSearchDni(valor);
            }
          }}
          inputMode="numeric"
          maxLength={8}
        />
        <button onClick={handleSearch}>Buscar</button>
        <button onClick={fetchProfesores}>Ver todos</button>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          name="dni"
          placeholder="DNI"
          value={form.dni}
          onChange={e => {
            const valor = e.target.value;
            if (/^\d{0,8}$/.test(valor)) {
              setForm({ ...form, dni: valor });
            }
          }}
          inputMode="numeric"
          maxLength={8}
          required
        />
        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={e => setForm({ ...form, nombre: e.target.value })}
          required
        />
        <input
          name="apellido"
          placeholder="Apellido"
          value={form.apellido}
          onChange={e => setForm({ ...form, apellido: e.target.value })}
          required
        />
        <input
          name="especialidad"
          placeholder="Especialidad"
          value={form.especialidad}
          onChange={e => setForm({ ...form, especialidad: e.target.value })}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Correo"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={e => {
            const valor = e.target.value;
            if (/^\d{0,9}$/.test(valor)) {
              setForm({ ...form, telefono: valor });
            }
          }}
          inputMode="numeric"
          maxLength={9}
          required
        />
        <button type="submit">{form.id ? 'Actualizar' : 'Registrar'}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>DNI</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Especialidad</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {profesores.map(profesor => (
            <tr key={profesor.id}>
              <td>{profesor.id}</td>
              <td>{profesor.dni}</td>
              <td>{profesor.nombre}</td>
              <td>{profesor.apellido}</td>
              <td>{profesor.especialidad}</td>
              <td>{profesor.email}</td>
              <td>{profesor.telefono}</td>
              <td>
                <button onClick={() => handleEdit(profesor)}>Modificar</button>
                <button onClick={() => handleDelete(profesor.dni)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}