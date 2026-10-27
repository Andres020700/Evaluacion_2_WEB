import { ListGroup, ListGroupItem, Button, ButtonGroup } from 'reactstrap';
import { actualizarUnidades, eliminarDeCarga } from '../../services/api';

function BodegaCarga({ items, onAccion, calculando }) {
    return (
        <div>
            <h2>Bodega de Carga</h2>

            <ListGroup>
                {items.map((item) => (
                    <ListGroupItem key={item.id}>
                        <p>{item.nombre} - Unidades: {item.cantidad}</p>

                        <ButtonGroup size="sm">
                            <Button
                                disabled={calculando || item.cantidad <= 1}
                                onClick={() => onAccion(() => actualizarUnidades(item.id, item.cantidad - 1), false)}
                            >
                                -
                            </Button>
                            <Button
                                disabled={calculando}
                                onClick={() => onAccion(() => actualizarUnidades(item.id, item.cantidad + 1))}
                            >
                                +
                            </Button>
                        </ButtonGroup>

                        <Button
                            color="danger"
                            outline
                            size="sm"
                            className="ms-2"
                            disabled={calculando}
                            onClick={() => onAccion(() => eliminarDeCarga(item.id), false)}
                        >
                            Desembarcar
                        </Button>
                    </ListGroupItem>
                ))}
            </ListGroup>
        </div>
    );
}

export default BodegaCarga;