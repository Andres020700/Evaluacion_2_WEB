const express = require('express');
const router = express.Router();

// Catálogo inicial. El stock disponible se modifica durante la misión.
const INVENTARIO_INICIAL = [
  { id: 201, nombre: 'Tanque de Oxígeno XL', precio: 50, stock: 5, categoria: 'Soporte Vital' },
  { id: 202, nombre: 'Propulsor Iónico', precio: 120, stock: 2, categoria: 'Propulsión' },
  { id: 203, nombre: 'Kit de Herramientas', precio: 35, stock: 4, categoria: 'Herramientas' },
  { id: 204, nombre: 'Raciones Espaciales', precio: 15, stock: 8, categoria: 'Alimentos' },
  { id: 205, nombre: 'Botiquín Médico', precio: 45, stock: 3, categoria: 'Medicina' },
  { id: 206, nombre: 'Batería de Emergencia', precio: 80, stock: 1, categoria: 'Energía' },
  { id: 207, nombre: 'Antena de Comunicaciones', precio: 60, stock: 0, categoria: 'Comunicaciones' },
  { id: 208, nombre: 'Filtro de Agua', precio: 25, stock: 6, categoria: 'Soporte Vital' },
];

const PRESUPUESTO = 500;
const DURACION_SESION_MS = 5 * 60 * 1000;
const MENSAJE_SESION_CERRADA = 'Sesión cerrada: la ventana de lanzamiento terminó. Inicia una nueva misión.';

// structuredClone evita que los cambios de stock alteren el catálogo original.
let inventario = structuredClone(INVENTARIO_INICIAL);
// La carga conserva solo identificador y cantidad; el resto viene del inventario.
let itemsCargados = [];
let inicioSesion = Date.now();

// Suma precio por cantidad de cada suministro cargado.
function calcularTotal() {
  return itemsCargados.reduce((total, item) => {
    const producto = buscarProducto(item.id);
    return total + (producto ? producto.precio * item.cantidad : 0);
  }, 0);
}

// El saldo se deriva del presupuesto y el total, evitando duplicar estado.
function calcularCreditos() {
  return PRESUPUESTO - calcularTotal();
}

// Devuelve segundos enteros y nunca un valor menor que cero.
function calcularTiempoRestante() {
  const transcurrido = Date.now() - inicioSesion;
  return Math.max(0, Math.ceil((DURACION_SESION_MS - transcurrido) / 1000));
}

// Busca un producto por su identificador numérico.
function buscarProducto(id) {
  return inventario.find((producto) => producto.id === id);
}

// Enriquece las filas internas con nombre y precio para la interfaz.
function armarRespuestaCarga() {
  const itemsConDetalle = itemsCargados.map((item) => {
    const producto = buscarProducto(item.id);
    return {
      id: item.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: item.cantidad,
    };
  });

  return {
    creditos: calcularCreditos(),
    itemsCargados: itemsConDetalle,
    total: calcularTotal(),
  };
}

// La sesión puede consultarse y reiniciarse aunque haya expirado.
router.get('/sesion', (req, res) => {
  const tiempoRestante = calcularTiempoRestante();
  res.status(200).json({ tiempoRestante, activa: tiempoRestante > 0 });
});

router.post('/sesion/reiniciar', (req, res) => {
  inventario = structuredClone(INVENTARIO_INICIAL);
  itemsCargados = [];
  inicioSesion = Date.now();
  res.status(200).json({
    mensaje: 'Sesión reiniciada',
    tiempoRestante: calcularTiempoRestante(),
    activa: true,
  });
});

// Protege inventario y operaciones de carga cuando termina la ventana.
function verificarSesion(req, res, next) {
  if (calcularTiempoRestante() === 0) {
    return res.status(403).json({ mensaje: MENSAJE_SESION_CERRADA });
  }
  return next();
}

router.use(verificarSesion);

router.get('/inventario', (req, res) => {
  res.status(200).json(inventario);
});

router.get('/carga', (req, res) => {
  res.status(200).json(armarRespuestaCarga());
});

router.post('/carga/agregar', (req, res) => {
  const cuerpo = req.body ?? {};
  const equipoId = Number(cuerpo.equipoId);
  const cantidad = cuerpo.cantidad;

  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    return res.status(400).json({ mensaje: 'La cantidad debe ser un número entero mayor a 0' });
  }

  const producto = buscarProducto(equipoId);
  if (!producto) {
    return res.status(404).json({ mensaje: 'Suministro no encontrado' });
  }

  // Se valida stock antes de créditos, y no se modifica estado antes de ambas.
  if (cantidad > producto.stock) {
    return res.status(400).json({ mensaje: 'Stock en base insuficiente' });
  }
  if (cantidad * producto.precio > calcularCreditos()) {
    return res.status(400).json({ mensaje: 'Créditos insuficientes para esta cantidad' });
  }

  const indiceCargado = itemsCargados.findIndex((item) => item.id === equipoId);
  if (indiceCargado >= 0) {
    itemsCargados[indiceCargado].cantidad += cantidad;
  } else {
    itemsCargados.push({ id: equipoId, cantidad });
  }
  producto.stock -= cantidad;

  return res.status(201).json({ mensaje: 'Suministro agregado a la carga', ...armarRespuestaCarga() });
});

router.put('/carga/actualizar-unidades/:id', (req, res) => {
  const id = Number(req.params.id);
  const cuerpo = req.body ?? {};
  const nuevaCantidad = cuerpo.cantidad;

  if (!Number.isInteger(nuevaCantidad) || nuevaCantidad <= 0) {
    return res.status(400).json({ mensaje: 'La cantidad debe ser un número entero mayor a 0' });
  }

  const producto = buscarProducto(id);
  if (!producto) {
    return res.status(404).json({ mensaje: 'Suministro no encontrado' });
  }

  const indiceCargado = itemsCargados.findIndex((item) => item.id === id);
  if (indiceCargado < 0) {
    return res.status(404).json({ mensaje: 'El suministro no está en la carga' });
  }

  const cantidadActual = itemsCargados[indiceCargado].cantidad;
  const diferencia = nuevaCantidad - cantidadActual;

  if (diferencia > 0) {
    // Primero se comprueba stock; luego el costo incremental contra el saldo.
    if (diferencia > producto.stock) {
      return res.status(400).json({ mensaje: 'Stock en base insuficiente' });
    }
    if (diferencia * producto.precio > calcularCreditos()) {
      return res.status(400).json({ mensaje: 'Créditos insuficientes para esta cantidad' });
    }
    producto.stock -= diferencia;
  } else if (diferencia < 0) {
    producto.stock += Math.abs(diferencia);
  }

  itemsCargados[indiceCargado].cantidad = nuevaCantidad;
  return res.status(200).json({ mensaje: 'Cantidad actualizada', ...armarRespuestaCarga() });
});

router.delete('/carga/eliminar/:id', (req, res) => {
  const id = Number(req.params.id);
  const indiceCargado = itemsCargados.findIndex((item) => item.id === id);

  if (indiceCargado < 0) {
    return res.status(404).json({ mensaje: 'El suministro no está en la carga' });
  }

  const producto = buscarProducto(id);
  producto.stock += itemsCargados[indiceCargado].cantidad;
  itemsCargados = itemsCargados.filter((item) => item.id !== id);

  return res.status(200).json({ mensaje: 'Suministro eliminado de la carga', ...armarRespuestaCarga() });
});

module.exports = router;