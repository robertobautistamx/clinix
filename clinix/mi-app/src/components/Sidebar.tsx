// ══════════════════════════════════════════════════════
//  components/Sidebar.tsx
// ══════════════════════════════════════════════════════

import { useCarrito } from '../context/CarritoContext';
import React from 'react';
import { Home, Users, User, Hospital, Pill, FileText, Lightbulb, Stethoscope, ShoppingCart } from 'lucide-react';

type Seccion =
  | 'inicio' | 'pacientes' | 'doctores' | 'hospital'
  | 'productos' | 'transacciones' | 'recomendaciones' | 'carrito';

interface Props {
  seccionActiva: Seccion;
  onNavegar: (s: Seccion) => void;
}

const NAV_ITEMS: { id: Seccion; label: string; Icon: any }[] = [
  { id: 'inicio',          label: 'Inicio',         Icon: Home },
  { id: 'pacientes',       label: 'Pacientes',      Icon: Users },
  { id: 'doctores',        label: 'Doctores',       Icon: User },
  { id: 'hospital',        label: 'Hospitales',     Icon: Hospital },
  { id: 'productos',       label: 'Productos',      Icon: Pill },
  { id: 'transacciones',   label: 'Transacciones',  Icon: FileText },
  { id: 'recomendaciones', label: 'Recomendaciones',Icon: Lightbulb },
];

export default function Sidebar({ seccionActiva, onNavegar }: Props) {
  const { totalItems } = useCarrito();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon"><Stethoscope size={20} /></span>
        <span className="sidebar-logo-text">MedAI</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`sidebar-btn${seccionActiva === item.id ? ' sidebar-btn--active' : ''}`}
            onClick={() => onNavegar(item.id)}
          >
            <span className="sidebar-btn-icon">{React.createElement(item.Icon, { size: 18 })}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Carrito */}
      <button
        className={`sidebar-btn sidebar-btn--carrito${seccionActiva === 'carrito' ? ' sidebar-btn--active' : ''}`}
        onClick={() => onNavegar('carrito')}
      >
        <span className="sidebar-btn-icon">{React.createElement(ShoppingCart, { size: 18 })}</span>
        <span>Carrito</span>
        {totalItems > 0 && <span className="carrito-badge">{totalItems}</span>}
      </button>

      {/* Perfil */}
      <button className="perfil-btn" onClick={() => onNavegar('pacientes')} title="Ver perfil">
        <div className="avatar-circulo" />
        <span className="perfil-label">Perfil</span>
      </button>
    </aside>
  );
}
