import { useState } from 'react';
import Reactor from './components/reactor/reactor';
import BodegaCarga from './components/astro/bodegacarga';

function App() {
  const [vista, setVista] = useState('reactor');

  return (
    <div>
      <h1>AstroLogistics</h1>

      <button onClick={() => setVista('reactor')}>
        Reactor
      </button>

      <button onClick={() => setVista('bodega')}>
        Bodega
      </button>

      {vista === 'reactor' && <Reactor/>}

      {vista === 'bodega' && <BodegaCarga/>}
    </div>
  );
}

export default App;