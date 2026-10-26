import { useEffect, useState } from 'react';
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

    useEffect(() => {
        cargarBodega();
    }, []);

    return (
        <div>
            <h2>Bodega de Carga</h2>

            <p>{mensaje}</p>

            <ul>
                {carga.map((item) => (
                    <li key={item.id}>
                        {item.nombre} - Unidades: {item.cantidad}

                        <button onClick={() => disminuir(item.id, item.cantidad)}>
                            -
                        </button>

                        <button onClick={() => aumentar(item.id, item.cantidad)}>
                            +
                        </button>

                        <button onClick={() => desembarcar(item.id)}>
                            Desembarcar
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BodegaCarga;