//  App.tsx  —  Punto de entrada principal
// ══════════════════════════════════════════════════════

import { ReactElement, useState } from 'react';
import './App.css';

import { CarritoProvider } from './context/CarritoContext';

import Inicio          from './pages/Inicio';
import Pacientes       from './pages/Pacientes';
import Doctores        from './pages/Doctores';
import Hospital        from './pages/Hospital';
import Productos       from './pages/Productos';
import Carrito         from './pages/Carrito';
import Transacciones   from './pages/Transacciones';
import Recomendaciones from './pages/Recomendaciones';
import Sidebar from './components/Sidebar';

type Seccion =
  | 'inicio' | 'pacientes' | 'doctores' | 'hospital'
  | 'productos' | 'transacciones' | 'recomendaciones' | 'carrito';

const PAGINAS: Record<Seccion, ReactElement> = {
  inicio:          <Inicio />,
  pacientes:       <Pacientes />,
  doctores:        <Doctores />,
  hospital:        <Hospital />,
  productos:       <Productos />,
  carrito:         <Carrito />,
  transacciones:   <Transacciones />,
  recomendaciones: <Recomendaciones />,
};

export default function App() {
  const [seccion, setSeccion] = useState<Seccion>('inicio');

  return (
    <CarritoProvider>
      <div className="layout">
        <Sidebar seccionActiva={seccion} onNavegar={setSeccion} />
        <main>
          <div className="page active">
            {PAGINAS[seccion]}
          </div>
        </main>
      </div>
    </CarritoProvider>
  );
}
