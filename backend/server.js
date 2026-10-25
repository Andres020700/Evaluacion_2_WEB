const express = require('express');
const path = require('path');

const reactorRoutes = require('./routes/reactor');
const cargaRoutes = require('./routes/carga');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/', reactorRoutes);   // /adjust y /reboot
app.use('/api', cargaRoutes);  // /api/inventario, /api/carga/..., /api/sesion

// Sirve el frontend compilado (después de las rutas de la API)
app.use(express.static(path.join(__dirname, '..', 'dist')));

app.listen(PORT, () => {
  console.log(`Aplicación en http://localhost:${PORT}`);
});