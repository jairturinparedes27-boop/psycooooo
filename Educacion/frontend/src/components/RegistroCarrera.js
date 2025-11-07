import { useState, useEffect } from 'react';
import axios from 'axios';
import './GestorCarreras.css'; // Puedes reutilizar estilos o crear nuevos

export default function GestorCarreras() {
  const [form, setForm] = useState({
    id: '',
    nombre: '',
    descripcion: ''
  });

  const [carreras, setCarreras] = useState([]);
  const [searchNombre, setSearchNombre] = useState('');

  useEffect(() => {
    fetchCarreras();
  }, []);

  const fetchCarreras = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/carrera');
      setCarreras(res.data);
    } catch (err) {
      alert('Error al cargar carreras');
    }
  };

  const handleSearch = async () => {
    if (!searchNombre) return;
    try {
      const res = await axios.get(`http://localhost:3001/api/carrera/${searchNombre}`);
      setCarreras([res.data]);
    } catch (err) {
      alert('Carrera no encontrada');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (form.id) {
        await axios.put(`http://localhost:3001/api/carrera/${form.id}`, form);
        alert('Carrera actualizada');
      } else {
        await axios.post('http://localhost:3001/api/carrera', form);
        alert('Carrera registrada');
      }
      setForm({ id: '', nombre: '', descripcion: '' });
      fetchCarreras();
    } catch (err) {
      if (err.response?.status === 409 && err.response.data?.message) {
        alert(err.response.data.message); // "La carrera ya está registrada"
      } else {
        alert('Error al guardar carrera');
      }
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar esta carrera?')) return;
    try {
      await axios.delete(`http://localhost:3001/api/carrera/${id}`);
      fetchCarreras();
    } catch (err) {
      alert('Error al eliminar carrera');
    }
  };

  const handleEdit = carrera => {
    setForm(carrera);
  };

  return (
    <div className="gestor-container">
      <h2>Gestión de Carreras</h2>

      <div className="busqueda">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchNombre}
          onChange={e => setSearchNombre(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>
        <button onClick={fetchCarreras}>Ver todas</button>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          name="nombre"
          placeholder="Nombre de la carrera"
          value={form.nombre}
          onChange={e => setForm({ ...form, nombre: e.target.value })}
          required
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={e => setForm({ ...form, descripcion: e.target.value })}
          required
        />
        <button type="submit">{form.id ? 'Actualizar' : 'Registrar'}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {carreras.map(carrera => (
            <tr key={carrera.id}>
              <td>{carrera.id}</td>
              <td>{carrera.nombre}</td>
              <td>{carrera.descripcion}</td>
              <td>
                <button onClick={() => handleEdit(carrera)}>Modificar</button>
                <button onClick={() => handleDelete(carrera.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}