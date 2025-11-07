import { useState, useEffect } from 'react';
import axios from 'axios';
import './GestorAlumnos.css';

export default function GestorAlumnos() {
  const [form, setForm] = useState({
    id: '',
    dni: '',
    nombre: '',
    apellido: '',
    fecha_nac: '',
    telefono: '',
    correo: '',
    carrera: ''
  });

  const [alumnos, setAlumnos] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [searchDni, setSearchDni] = useState('');

  useEffect(() => {
    fetchAlumnos();
    fetchCarreras();
  }, []);

  const fetchAlumnos = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/alumno');
      setAlumnos(res.data);
    } catch (err) {
      alert('Error al cargar alumnos');
    }
  };

  const fetchCarreras = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/carrera');
      setCarreras(res.data);
    } catch (err) {
      alert('Error al cargar carreras');
    }
  };

  const handleSearch = async () => {
    if (!/^\d{8}$/.test(searchDni)) {
      alert('El DNI debe tener exactamente 8 dígitos numéricos');
      return;
    }

    try {
      const res = await axios.get(`http://localhost:3001/api/alumno/${searchDni}`);
      setAlumnos([res.data]);
    } catch (err) {
      alert('Alumno no encontrado');
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

    const fechaIngresada = new Date(form.fecha_nac);
    const hoy = new Date();
    const limiteInferior = new Date('1900-01-01');

    if (fechaIngresada > hoy) {
      alert('La fecha de nacimiento no puede ser futura');
      return;
    }

    if (fechaIngresada < limiteInferior) {
      alert('La fecha de nacimiento no puede ser anterior al año 1900');
      return;
    }

    try {
      if (form.id) {
        await axios.put(`http://localhost:3001/api/alumno/${form.dni}`, form);
        alert('Alumno actualizado');
      } else {
        await axios.post('http://localhost:3001/api/alumno', form);
        alert('Alumno registrado');
      }

      setForm({
        id: '',
        dni: '',
        nombre: '',
        apellido: '',
        fecha_nac: '',
        telefono: '',
        correo: '',
        carrera: ''
      });

      fetchAlumnos();
    } catch (err) {
      if (err.response?.status === 409 && err.response.data?.conflictos) {
        alert(err.response.data.conflictos.join('\n'));
      } else {
        alert('Error al guardar alumno');
      }
    }
  };

  const handleDelete = async dni => {
    if (!window.confirm('¿Eliminar este alumno?')) return;
    try {
      await axios.delete(`http://localhost:3001/api/alumno/${dni}`);
      fetchAlumnos();
    } catch (err) {
      alert('Error al eliminar alumno');
    }
  };

  const formatFechaISO = iso => {
    const date = new Date(iso);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleEdit = alumno => {
    setForm({
      ...alumno,
      fecha_nac: formatFechaISO(alumno.fecha_nac)
    });
  };

  return (
    <div className="gestor-container">
      <h2>Gestión de Alumnos</h2>

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
        <button onClick={fetchAlumnos}>Ver todos</button>
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
          name="fecha_nac"
          type="date"
          value={form.fecha_nac}
          onChange={e => setForm({ ...form, fecha_nac: e.target.value })}
          max={new Date().toISOString().split('T')[0]}
          min="1900-01-01"
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
        <input
          name="correo"
          type="email"
          placeholder="Correo"
          value={form.correo}
          onChange={e => setForm({ ...form, correo: e.target.value })}
          required
        />

        <select
          name="carrera"
          value={form.carrera}
          onChange={e => setForm({ ...form, carrera: e.target.value })}
          required
        >
          <option value="">Selecciona una carrera</option>
          {carreras.map(c => (
            <option key={c.id} value={c.nombre}>
              {c.nombre}
            </option>
          ))}
        </select>

        <button type="submit">{form.id ? 'Actualizar' : 'Registrar'}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>DNI</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Fecha Nac.</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Carrera</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map(alumno => (
            <tr key={alumno.id}>
              <td>{alumno.id}</td>
              <td>{alumno.dni}</td>
              <td>{alumno.nombre}</td>
              <td>{alumno.apellido}</td>
              <td>
                {new Date(alumno.fecha_nac).toLocaleDateString('es-PE', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </td>
              <td>{alumno.telefono}</td>
              <td>{alumno.correo}</td>
              <td>{alumno.carrera}</td>
              <td>
                <button onClick={() => handleEdit(alumno)}>Modificar</button>
                <button onClick={() => handleDelete(alumno.dni)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}