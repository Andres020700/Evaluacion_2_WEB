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
  const [version, setVersion] = useState(0);

  const refrescar = async () => {
    try {
      const [inv, car] = await Promise.all([getInventario(), getCarga()]);
      setInventario(inv);
      setCarga(car);
      setVersion((v) => v + 1); // remonta la Bodega para que recargue
    } catch (e) {
      setError({ msg: e.message, id: Date.now() });
    }
  };

  useEffect(() => {
    refrescar();
  }, []);

  const agregar = async (equipoId) => {
    setCalculando(true);
    setError(null);
    try {
      await agregarACarga(equipoId, 1);
      await refrescar();
    } catch (e) {
      setError({ msg: e.message, id: Date.now() });
    } finally {
      setCalculando(false);
    }
  };

  return (
    <Container className="mt-3">
      {error && (
        <UncontrolledAlert key={error.id} color="warning">
          {error.msg}
        </UncontrolledAlert>
      )}
      <SessionTimer onRestart={refrescar} />
      <PanelMision creditos={carga.creditos} total={carga.total} />
      {calculando && <p className="text-muted">Calculando peso...</p>}
      <Row>
        <Col md="8">
          <Catalogo inventario={inventario} onAgregar={agregar} calculando={calculando} />
        </Col>
        <Col md="4">
          <BodegaCarga key={version} onCambio={refrescar} />
        </Col>
      </Row>
    </Container>
  );
}

export default Astro;