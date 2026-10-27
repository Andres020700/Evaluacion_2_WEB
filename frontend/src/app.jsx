import { useState } from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import Reactor from './components/reactor/reactor';
import Astro from './components/astro/astro';

function App() {
  const [vista, setVista] = useState('reactor');

  const cambiarVista = (evento, nuevaVista) => {
    evento.preventDefault();
    setVista(nuevaVista);
  };

  return (
    <div>
      <Navbar dark color="dark" className="px-3 mb-3">
        <NavbarBrand>Evaluación II · Programación Web</NavbarBrand>
        <Nav pills>
          <NavItem>
            <NavLink href="#" active={vista === 'reactor'} onClick={(e) => cambiarVista(e, 'reactor')}>
              Ejercicio 1: Reactor
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#" active={vista === 'astro'} onClick={(e) => cambiarVista(e, 'astro')}>
              Ejercicio 2: AstroLogistics
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>

      {/* El Reactor se oculta en vez de desmontarse, así conserva su historial */}
      <div style={{ display: vista === 'reactor' ? 'block' : 'none' }}>
        <Reactor />
      </div>
      {vista === 'astro' && <Astro />}
    </div>
  );
}

export default App;