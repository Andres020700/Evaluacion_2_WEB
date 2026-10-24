// Función auxiliar: hace la petición y lanza un error si el servidor responde con error
const request = async (url, options = {}) => {
  const respuesta = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  const data = await respuesta.json();

  if (!respuesta.ok) {
    const error = new Error(data.mensaje || 'Error en la petición');
    error.status = respuesta.status;
    throw error;
  }

  return data;
};

// Sesión (Persona 1)
export const getSesion = () => request('/api/sesion');
export const reiniciarSesion = () => request('/api/sesion/reiniciar', { method: 'POST' });

// Persona 2: agrega aquí abajo las demás funciones (ajustarTemperatura, getInventario, etc.)
// También conviene exportar `request` si las necesita.
export { request };