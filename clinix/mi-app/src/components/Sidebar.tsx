// ══════════════════════════════════════════════════════
//  components/Sidebar.tsx
// ══════════════════════════════════════════════════════

import React, { useCallback, useMemo, useState } from 'react';
import { useCarrito } from '../context/CarritoContext';
import { Home, Users, User, Hospital, Pill, FileText, Lightbulb, Stethoscope, ShoppingCart, Search, Menu, ChevronLeft } from 'lucide-react';

type Seccion =
  | 'inicio' | 'pacientes' | 'doctores' | 'hospital'
  | 'productos' | 'transacciones' | 'recomendaciones' | 'carrito';

interface Props {
  seccionActiva: Seccion;
  onNavegar: (s: Seccion) => void;
  isOpen: boolean;
  onToggle: () => void;
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

export default function Sidebar({ seccionActiva, onNavegar, isOpen, onToggle }: Props) {
  const { totalItems } = useCarrito();
  const [query, setQuery] = useState('');

  const handleNav = useCallback(
    (id: Seccion) => {
      setQuery('');
      onNavegar(id);
    },
    [onNavegar]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return NAV_ITEMS;
    return NAV_ITEMS.filter((item) => item.label.toLowerCase().includes(q));
  }, [query]);

  return (
    <aside className="sidebar" style={{ width: isOpen ? 250 : 70, transition: 'width 0.3s ease', overflowX: 'hidden' }} aria-label="Navegación principal">
      {/* Logo */}
      <div className="sidebar-logo" style={{ justifyContent: isOpen ? 'flex-start' : 'center', padding: isOpen ? '24px' : '24px 0' }}>
        <span className="sidebar-logo-icon" onClick={onToggle} style={{ cursor: 'pointer' }}>
          {isOpen ? <Stethoscope size={20} /> : <Menu size={20} />}
        </span>
        {isOpen && <span className="sidebar-logo-text">MedAI</span>}
        {isOpen && <button onClick={onToggle} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }}><ChevronLeft size={18} /></button>}
      </div>

      {/* Search */}
      {isOpen ? (
        <div className="sidebar-search">
          <Search size={16} />
          <input
            aria-label="Buscar sección"
            placeholder="Buscar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      ) : (
        <div className="sidebar-search" style={{ justifyContent: 'center', cursor: 'pointer', padding: '12px 0', border: 'none', background: 'transparent' }} onClick={onToggle}>
          <Search size={20} color="rgba(255,255,255,0.7)" />
        </div>
      )}

      {/* Nav */}
      <nav className="sidebar-nav">
        {filtered.map((item) => (
          <button
            key={item.id}
            className={`sidebar-btn${seccionActiva === item.id ? ' sidebar-btn--active' : ''}`}
            onClick={() => handleNav(item.id)}
            style={{ justifyContent: isOpen ? 'flex-start' : 'center', padding: isOpen ? '12px 16px' : '12px 0' }}
            aria-current={seccionActiva === item.id ? 'page' : undefined}
            title={item.label}
          >
            <span className="sidebar-btn-icon">{React.createElement(item.Icon, { size: 18 })}</span>
            {isOpen && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Carrito */}
      <button
        className={`sidebar-btn sidebar-btn--carrito${seccionActiva === 'carrito' ? ' sidebar-btn--active' : ''}`}
        onClick={() => handleNav('carrito')}
        style={{ justifyContent: isOpen ? 'flex-start' : 'center', padding: isOpen ? '12px 16px' : '12px 0' }}
        aria-current={seccionActiva === 'carrito' ? 'page' : undefined}
        title="Carrito"
      >
        <span className="sidebar-btn-icon">{React.createElement(ShoppingCart, { size: 18 })}</span>
        {isOpen && <span>Carrito</span>}
        {totalItems > 0 && <span className="carrito-badge" style={isOpen ? {} : { position: 'absolute', top: 5, right: 15 }}>{totalItems}</span>}
      </button>

      {/* Perfil */}
      <button className="perfil-btn" onClick={() => handleNav('pacientes')} title="Ver perfil" style={{ justifyContent: isOpen ? 'flex-start' : 'center' }}>
        <div className="avatar-circulo" style={isOpen ? {} : { marginRight: 0 }} />
        {isOpen && <span className="perfil-label">Perfil</span>}
      </button>
    </aside>
  );
}
