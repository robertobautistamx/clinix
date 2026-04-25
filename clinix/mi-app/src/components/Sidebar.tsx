// ══════════════════════════════════════════════════════
//  components/Sidebar.tsx
// ══════════════════════════════════════════════════════

import { useCarrito } from '../context/CarritoContext';

type Seccion =
  | 'inicio' | 'pacientes' | 'doctores' | 'hospital'
  | 'productos' | 'transacciones' | 'recomendaciones' | 'carrito';

interface Props {
  seccionActiva: Seccion;
  onNavegar: (s: Seccion) => void;
}

const NAV_ITEMS: { id: Seccion; label: string; icon: string }[] = [
  { id: 'inicio',          label: 'Inicio',         icon: '🏠' },
  { id: 'pacientes',       label: 'Pacientes',       icon: '🧑‍⚕️' },
  { id: 'doctores',        label: 'Doctores',        icon: '👨‍⚕️' },
  { id: 'hospital',        label: 'Hospitales',      icon: '🏥' },
  { id: 'productos',       label: 'Productos',       icon: '💊' },
  { id: 'transacciones',   label: 'Transacciones',   icon: '📋' },
  { id: 'recomendaciones', label: 'Recomendaciones', icon: '🤖' },
];

export default function Sidebar({ seccionActiva, onNavegar }: Props) {
  const { totalItems } = useCarrito();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">🩺</span>
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
            <span className="sidebar-btn-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Carrito */}
      <button
        className={`sidebar-btn sidebar-btn--carrito${seccionActiva === 'carrito' ? ' sidebar-btn--active' : ''}`}
        onClick={() => onNavegar('carrito')}
      >
        <span className="sidebar-btn-icon">🛒</span>
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
