const express = require('express');
const router = express.Router();

const generarTemperatura = () => Math.floor(Math.random() * 100) + 1;

let temperaturaIdeal = generarTemperatura();
console.log('Temperatura ideal (solo para pruebas):', temperaturaIdeal);

router.post('/adjust', (req, res) => {
  const { temperatura } = req.body;
  const valor = Number(temperatura);

  if (temperatura === undefined || temperatura === '' || Number.isNaN(valor) || valor < 1 || valor > 100) {
    return res.status(400).json({
      mensaje: 'La temperatura debe ser un número entre 1 y 100'
    });
  }

  if (valor === temperaturaIdeal) {
    return res.json({ estado: 'estabilizado', mensaje: 'Reactor estabilizado', estabilizado: true });
  }

  if (valor < temperaturaIdeal) {
    return res.json({ estado: 'más alta', mensaje: 'La temperatura ideal es más alta', estabilizado: false });
  }

  return res.json({ estado: 'más baja', mensaje: 'La temperatura ideal es más baja', estabilizado: false });
});

router.post('/reboot', (req, res) => {
  temperaturaIdeal = generarTemperatura();
  console.log('Nueva temperatura ideal (solo para pruebas):', temperaturaIdeal);
  res.json({ mensaje: 'Sistema reiniciado' });
});

module.exports = router;