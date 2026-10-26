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
export const ajustarTemperatura = (temperatura) => request('/adjust',
  {
    method: 'POST',
    body: JSON.stringify({temperatura: Number(temperatura)})
  });

export const reiniciarReactor = () => request('/reboot', {method: 'POST'});

//Bodega de Carga
export const getCarga = () => request('/api/carga');

export const actualizarUnidades = (id, cantidad) => request(`/api/carga/actualizar-unidades/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify({cantidad})
    });

export const eliminarDeCarga = (id) => request(`/api/carga/eliminar/${id}`, 
    {
      method: 'DELETE'
    });

//catalogo
export const getInventario = () =>
  request('/api/inventario');

export const agregarACarga = (equipoId, cantidad = 1) => request('/api/carga/agregar', 
  {
    method: 'POST',
    body: JSON.stringify({equipoId,cantidad})
  });

export { request };
