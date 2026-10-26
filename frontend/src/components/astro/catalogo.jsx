import { Row, Col, Card, CardBody, CardTitle, CardSubtitle, Badge, Button } from 'reactstrap';

function Catalogo({ inventario, onAgregar, calculando }) {
  return (
    <Row>
      {inventario.map((item) => (
        <Col md="4" xs="12" key={item.id}>
          <Card className="mb-3">
            <CardBody>
              <CardTitle tag="h5">{item.nombre}</CardTitle>
              <CardSubtitle className="mb-2 text-muted">{item.categoria}</CardSubtitle>
              <Badge color="success">{item.precio} Cr</Badge>
              <p className="mt-2">Stock: {item.stock}</p>
              {item.stock === 0 ? (
                <Button color="secondary" disabled>
                  Agotado en Base
                </Button>
              ) : (
                <Button color="primary" disabled={calculando} onClick={() => onAgregar(item.id)}>
                  Añadir a la Nave
                </Button>
              )}
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default Catalogo;