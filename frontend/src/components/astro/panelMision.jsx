import { Alert, Badge } from 'reactstrap';

function PanelMision({ creditos, total }) {
  return (
    <Alert color="info" className="d-flex justify-content-between">
      <span>Créditos disponibles: {creditos} Cr</span>
      <span>
        Costo total de Carga: <Badge color="dark" pill>{total} Cr</Badge>
      </span>
    </Alert>
  );
}

export default PanelMision;