import { useState, useEffect } from 'react';
import axios from 'axios';
import './GestorCarreras.css'; // Puedes usar el mismo estilo

export default function GestorCursos() {
  const [form, setForm] = useState({
    id: '',
    code: '',
    name: '',
    credits: ''
  });

  const [cursos, setCursos] = useState([]);
  const [searchCode, setSearchCode] = useState('');

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/curso');
      setCursos(res.data);
    } catch (err) {
      alert('Error al cargar cursos');
    }
  };

  const handleSearch = async () => {
    if (!searchCode) return;
    try {
      const res = await axios.get(`http://localhost:3001/api/curso/${searchCode}`);
      setCursos([res.data]);
    } catch (err) {
      alert('Curso no encontrado');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (form.id) {
        await axios.put(`http://localhost:3001/api/curso/${form.id}`, form);
        alert('Curso actualizado');
      } else {
        await axios.post('http://localhost:3001/api/curso', form);
        alert('Curso registrado');
      }

      setForm({ id: '', code: '', name: '', credits: '' });
      fetchCursos();
    } catch (err) {
      if (err.response?.status === 409 && err.response.data?.conflictos) {
        alert(err.response.data.conflictos.join('\n'));
      } else {
        alert('Error al guardar curso');
      }
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar este curso?')) return;
    try {
      await axios.delete(`http://localhost:3001/api/curso/${id}`);
      fetchCursos();
    } catch (err) {
      alert('Error al eliminar curso');
    }
  };

  const handleEdit = curso => {
    setForm(curso);
  };

  return (
    <div className="gestor-container">
      <h2>Gestión de Cursos</h2>

      <div className="busqueda">
        <input
          type="text"
          placeholder="Buscar por código"
          value={searchCode}
          onChange={e => setSearchCode(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>
        <button onClick={fetchCursos}>Ver todos</button>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          name="code"
          placeholder="Código"
          value={form.code}
          onChange={e => setForm({ ...form, code: e.target.value })}
          required
        />
        <input
          name="name"
          placeholder="Nombre del curso"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          name="credits"
          type="number"
          placeholder="Créditos"
          value={form.credits}
          onChange={e => setForm({ ...form, credits: e.target.value })}
          required
        />
        <button type="submit">{form.id ? 'Actualizar' : 'Registrar'}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Código</th>
            <th>Nombre</th>
            <th>Créditos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cursos.map(curso => (
            <tr key={curso.id}>
              <td>{curso.id}</td>
              <td>{curso.code}</td>
              <td>{curso.name}</td>
              <td>{curso.credits}</td>
              <td>
                <button onClick={() => handleEdit(curso)}>Modificar</button>
                <button onClick={() => handleDelete(curso.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}