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



module.exports = router;