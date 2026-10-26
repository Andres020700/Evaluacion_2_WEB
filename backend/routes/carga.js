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



module.exports = router;