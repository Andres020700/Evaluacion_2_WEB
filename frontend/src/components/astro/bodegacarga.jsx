import { useEffect, useState } from 'react';
import { ListGroup, ListGroupItem, Button, ButtonGroup } from 'reactstrap';
import { getCarga, actualizarUnidades, eliminarDeCarga } from '../../services/api';

function BodegaCarga({onCambio}) {
    const [carga, setCarga] = useState([]);

    async function cargarBodega() {
        try {
            const respuesta = await getCarga();

            setCarga(respuesta.itemsCargados);
        } catch (error) {
            setMensaje(error.message);
        }
    }

   async function cambiar(accion) {
        try {
            await accion();
            onCambio();
        } catch (error) {
            onError(error.message);
        }
    }
    useEffect(() => { cargarBodega(); }, []);

    return (
        <div>
            <h2>Bodega de Carga</h2>

            <ListGroup>
                {carga.map((item) => (
                    <ListGroupItem key={item.id}>
                        <p>{item.nombre} - Unidades: {item.cantidad}</p>

                        <ButtonGroup size="sm">
                            <Button
                                disabled={item.cantidad <= 1}
                                onClick={() => cambiar(() => actualizarUnidades(item.id, item.cantidad - 1))}
                            >
                                -
                            </Button>
                            <Button
                                onClick={() => cambiar(() => actualizarUnidades(item.id, item.cantidad + 1))}
                            >
                                +
                            </Button>
                        </ButtonGroup>

                        <Button
                            color="danger"
                            outline
                            size="sm"
                            className="ms-2"
                            onClick={() => cambiar(() => eliminarDeCarga(item.id))}
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