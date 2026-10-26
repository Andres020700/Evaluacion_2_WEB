import { useEffect, useState } from 'react';
import { ListGroup, ListGroupItem, Button, ButtonGroup } from 'reactstrap';
import { getCarga, actualizarUnidades, eliminarDeCarga } from '../../services/api';

function BodegaCarga() {
    const [carga, setCarga] = useState([]);
    const [mensaje, setMensaje] = useState('');

    async function cargarBodega() {
        try {
            const respuesta = await getCarga();

            setCarga(respuesta.itemsCargados);
        } catch (error) {
            setMensaje(error.message);
        }
    }

    async function aumentar(id, cantidadActual) {
        try {
            await actualizarUnidades(id, cantidadActual + 1);
            await cargarBodega();
        } catch (error) {
            setMensaje(error.message);
        }
    }

    async function disminuir(id, cantidadActual) {
        try {
            if (cantidadActual > 1) {
                await actualizarUnidades(id, cantidadActual - 1);
                await cargarBodega();
            }
        } catch (error) {
            setMensaje(error.message);
        }
    }

    async function desembarcar(id) {
        try {
            await eliminarDeCarga(id);
            await cargarBodega();
        } catch (error) {
            setMensaje(error.message);
        }
    }

    useEffect(() => { cargarBodega(); }, []);

    return (
        <div>
            <h2>Bodega de Carga</h2>

            <p>{mensaje}</p>

            <ListGroup>
                {carga.map((item) => (
                    <ListGroupItem key={item.id}>
                        <p>
                            {item.nombre} - Unidades: {item.cantidad}
                        </p>

                        <ButtonGroup size="sm">
                            <Button
                                onClick={() => disminuir(item.id, item.cantidad)}
                            >
                                -
                            </Button>

                            <Button
                                onClick={() => aumentar(item.id, item.cantidad)}
                            >
                                +
                            </Button>
                        </ButtonGroup>

                        <Button
                            onClick={() => desembarcar(item.id)}
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