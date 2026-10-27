import { useEffect, useState } from 'react';
import { Container, Row, Col, UncontrolledAlert } from 'reactstrap';
import { getInventario, getCarga, agregarACarga } from '../../services/api';
import PanelMision from './panelMision';
import Catalogo from './catalogo';
import BodegaCarga from './bodegacarga';
import SessionTimer from './sessionTimer';

function Astro() {
  const [inventario, setInventario] = useState([]);
  const [carga, setCarga] = useState({ creditos: 0, itemsCargados: [], total: 0 });
  const [error, setError] = useState(null);
  const [calculando, setCalculando] = useState(false);
  const [expirada, setExpirada] = useState(false);

  const refrescar = async () => {
    try {
      const [inv, car] = await Promise.all([getInventario(), getCarga()]);
      setInventario(inv);
      setCarga(car);
    } catch (e) {
      setError({ msg: e.message, id: Date.now() });
    }
  };

  useEffect(() => {
    refrescar();
  }, []);

  // Envuelve cualquier acción (añadir, -, +, desembarcar): muestra
  // "Calculando peso...", captura el error del backend y refresca los datos.
  const ejecutar = async (accion, mostrarCalculo = true) => {
    if (mostrarCalculo) setCalculando(true);
    setError(null);
    try {
        await new Promise((r) => setTimeout(r, 400));
      await accion();
      await refrescar();
    } catch (e) {
      setError({ msg: e.message, id: Date.now() });
    } finally {
      setCalculando(false);
    }
  };

  const agregar = (equipoId) => ejecutar(() => agregarACarga(equipoId, 1));

  return (
    <Container className="mt-3">
      {error && (
        <UncontrolledAlert key={error.id} color="warning">
          {error.msg}
        </UncontrolledAlert>
      )}
      <SessionTimer onRestart={refrescar} onEstado={setExpirada} />
      {!expirada && (
        <>
          <PanelMision creditos={carga.creditos} total={carga.total} />
          {calculando && <p className="text-info fw-bold">Calculando peso...</p>}
          <Row>
            <Col md="8">
              <Catalogo inventario={inventario} onAgregar={agregar} calculando={calculando} />
            </Col>
            <Col md="4">
              <BodegaCarga
                items={carga.itemsCargados}
                onAccion={ejecutar}
                calculando={calculando}
              />
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}

export default Astro;