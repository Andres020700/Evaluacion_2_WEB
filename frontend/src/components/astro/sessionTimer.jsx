import { useEffect, useState } from 'react';
import { Badge, Alert, Button } from 'reactstrap';
import { getSesion, reiniciarSesion } from '../../services/api';

// Convierte segundos a formato mm:ss
const formatear = (total) => {
  const min = String(Math.floor(total / 60)).padStart(2, '0');
  const seg = String(total % 60).padStart(2, '0');
  return `${min}:${seg}`;
};

function SessionTimer({ onRestart, onExpire }) {
  const [segundos, setSegundos] = useState(null);
  const [expirada, setExpirada] = useState(false);

  // Consulta al backend el tiempo restante y si la sesión sigue activa
  const cargarSesion = async () => {
    try {
      const data = await getSesion();
      setSegundos(data.tiempoRestante);
      setExpirada(!data.activa);
      if (!data.activa && onExpire) {
        onExpire();
      }
    } catch (error) {
      console.error('Error al consultar la sesión', error);
    }
  };

  // Al montar el componente, pide el tiempo inicial
  useEffect(() => {
    cargarSesion();
  }, []);

  // Cuenta regresiva: baja 1 segundo cada vez que cambia `segundos`
  useEffect(() => {
    if (segundos === null || expirada) return;

    if (segundos <= 0) {
      setExpirada(true);
      if (onExpire) onExpire();
      return;
    }

    const id = setTimeout(() => setSegundos((s) => s - 1), 1000);

    // Limpieza: evita temporizadores duplicados al re-renderizar
    return () => clearTimeout(id);
  }, [segundos, expirada]);

  const handleReiniciar = async () => {
    try {
      await reiniciarSesion();
      await cargarSesion();
      setExpirada(false);
      if (onRestart) onRestart(); // el componente padre recarga inventario y carga
    } catch (error) {
      console.error('Error al reiniciar', error);
    }
  };

  // Pantalla de sesión cerrada
  if (expirada) {
    return (
      <Alert color="danger" className="text-center">
        <h4>Sesión cerrada</h4>
        <p>La ventana de lanzamiento terminó antes de completar la carga.</p>
        <Button color="primary" onClick={handleReiniciar}>
          Iniciar nueva misión
        </Button>
      </Alert>
    );
  }

  // Contador visible: rojo cuando quedan 30 segundos o menos
  return (
    <Badge color={segundos !== null && segundos <= 30 ? 'danger' : 'warning'} pill>
      Tiempo restante: {segundos === null ? '--:--' : formatear(segundos)}
    </Badge>
  );
}

export default SessionTimer;