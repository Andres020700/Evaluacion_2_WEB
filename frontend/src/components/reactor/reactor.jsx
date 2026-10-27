import { useState } from 'react';
import { ajustarTemperatura, reiniciarReactor } from '../../services/api';

function Reactor() {
    const [temperatura, setTemperatura] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [historial, setHistorial] = useState([]);
    const [estabilizado, setEstabilizado] = useState(false);

    async function enviarTemperatura(evento) {
        evento.preventDefault();

        try {
            const respuesta = await ajustarTemperatura(temperatura);
            setMensaje(respuesta.mensaje);
            setEstabilizado(respuesta.estabilizado);

            if (respuesta.estabilizado === false) {
                const nuevoHistorial = [...historial, temperatura];
                setHistorial(nuevoHistorial);
            }

        } catch (error) {
            setMensaje(error.message);
        }
    }

    async function reiniciar() {
        try {
            await reiniciarReactor();

            setTemperatura('');
            setMensaje('');
            setHistorial([]);
            setEstabilizado(false);

        } catch (error) {
            setMensaje(error.message);
        }
    }

    return (
        <div className="reactor">
            <h2>Reactor</h2>

            <form onSubmit={enviarTemperatura}>
                <input
                    type="number"
                    value={temperatura}
                    onChange={(evento) => setTemperatura(evento.target.value)}
                    placeholder="Ingrese temperatura"
                    disabled={estabilizado}
                />

                <button type="submit" disabled={estabilizado}>
                    Ajustar
                </button>
            </form>

            <p>{mensaje}</p>

            <h3>Historial</h3>

            <ul>
                {historial.map((temperaturaIntentada, posicion) => (
                    <li key={posicion}>
                        {temperaturaIntentada}
                    </li>
                ))}
            </ul>

            <button onClick={reiniciar}>
                Reiniciar
            </button>
        </div>
    );
}

export default Reactor;