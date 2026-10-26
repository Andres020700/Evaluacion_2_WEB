# Evaluacion_2_WEB

# Evaluación II – Programación Web

AstroLogistics Ltd. + Estabiliza el Reactor

**Integrantes:**
- Hector Andres Lopez Medrano
- Rodrigo Javier Mendoza Alvarado
- Angel Gabriel Piche Martinez
- Fernando José Rivas Henríquez

## Requisitos
- Node.js 18 o superior

## Ejecución (un solo puerto)
```bash
npm install
npm run build
npm start
```
Abrir http://localhost:3000

## Desarrollo (dos terminales)
```bash
npm run dev:server   # backend en http://localhost:3000
npm run dev:client   # frontend en http://localhost:5173
```
Si se usa solo el puerto 3000, hay que volver a ejecutar `npm run build` después de cambiar el frontend.

## Endpoints

### Ejercicio 1 – Reactor
| Método | Ruta | Descripción |
|---|---|---|
| POST | /adjust | Recibe `{ temperatura }` y responde si es más alta, más baja o estabilizado |
| POST | /reboot | Reinicia el sistema y genera una nueva temperatura |

### Ejercicio 2 – AstroLogistics
| Método | Ruta | Descripción |
|---|---|---|
| GET | /api/inventario | Lista de suministros con precio y stock |
| GET | /api/carga | Créditos, ítems cargados y total |
| POST | /api/carga/agregar | Agrega un suministro a la carga |
| PUT | /api/carga/actualizar-unidades/:id | Cambia la cantidad de un suministro |
| DELETE | /api/carga/eliminar/:id | Elimina un suministro y devuelve el stock |
| GET | /api/sesion | Tiempo restante de la sesión |
| POST | /api/sesion/reiniciar | Reinicia la sesión |

## Estructura del proyecto
```
server/      Backend con Express (server.js y routes/)
frontend/    Frontend con React + Vite + Reactstrap
```
