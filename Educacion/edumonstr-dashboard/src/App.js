import React, { useEffect } from 'react'; // Importamos useEffect
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NextClass from './components/NextClass';
import GradesProgress from './components/GradesProgress';
import Schedule from './components/Schedule';
import PendingTasks from './components/PendingTasks';
import CampusNews from './components/CampusNews';
import LoginPage from './components/LoginPage';
import AdminPanel from './components/AdminPanel';

function App() {
  useEffect(() => {
    // Título inicial
    document.title = "Panel de Estudiante";

    // Cambiar título automáticamente después de 5 segundos
    const timeout = setTimeout(() => {
      document.title = "¡Estudia sonso! 😜";
    }, 5000);

    // Cambiar título si el usuario sale de la pestaña
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "¡Estudia sonso! 😜"; // Cuando el usuario cambia de pestaña
      } else {
        document.title = "Panel de Estudiante"; // Cuando vuelve
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Limpiar el timeout y el event listener al desmontar
    return () => {
      clearTimeout(timeout);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <>
      <AdminPanel />
      <LoginPage />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4">
          <Header />
          <h2 className="my-4">Panel de Estudiante</h2>
          <NextClass />
          <GradesProgress />
          <Schedule />
          <PendingTasks />
          <CampusNews />
        </div>
      </div>
    </>
  );
}

export default App;
