// ══════════════════════════════════════════════════════
//  pages/Carrito.tsx
// ══════════════════════════════════════════════════════

import { useCarrito } from '../context/CarritoContext';
import { transaccionesService } from '../services/api';
import { useState } from 'react';

export default function Carrito() {
  const { items, quitar, cambiarCantidad, vaciar, total, totalItems } = useCarrito();
  const [comprando, setComprando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  async function finalizarCompra() {
    if (items.length === 0) return;
    setComprando(true);
    setMensaje('');
    try {
      await transaccionesService.create({ total });
      vaciar();
      setMensaje('✅ ¡Compra realizada con éxito!');
    } catch (err: unknown) {
      setMensaje('⚠️ ' + (err instanceof Error ? err.message : 'Error al procesar'));
    } finally {
      setComprando(false);
    }
  }

  if (items.length === 0) {
    return (
      <section>
        <h2><b>Carrito</b></h2>
        {mensaje && <p style={{ color: '#27ae60', fontWeight: 700 }}>{mensaje}</p>}
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ fontSize: '3em' }}>🛒</p>
          <p>Tu carrito está vacío. Agrega productos desde la sección <b>Productos</b>.</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2><b>Carrito</b></h2>
      <p className="hospital-subtitulo">{totalItems} producto(s) en tu carrito</p>

      {items.map((item) => {
        const precioStr = (item as any).unit_price ?? item.price;
        const precioNum = precioStr != null ? Number(precioStr) : 0;
        
        return (
          <div key={item.product_id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            <span style={{ fontSize: '2em' }}>💊</span>
            <div style={{ flex: 1 }}>
              <b>{item.name}</b>
              <p style={{ margin: 0, fontSize: '0.88em', color: '#7a94a8' }}>
                ${precioStr != null ? precioNum.toFixed(2) : '—'} MXN c/u
              </p>
            </div>

            {/* Cantidad */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button className="qty-btn" onClick={() => cambiarCantidad(item.product_id, item.cantidad - 1)}>−</button>
              <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{item.cantidad}</span>
              <button className="qty-btn" onClick={() => cambiarCantidad(item.product_id, item.cantidad + 1)}>+</button>
            </div>

            <b style={{ minWidth: 70, textAlign: 'right' }}>
              ${(precioNum * item.cantidad).toFixed(2)}
            </b>

            <button className="btn-quitar" onClick={() => quitar(item.product_id)} title="Eliminar">✕</button>
          </div>
        );
      })}

      {/* Footer */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
        <div>
          <p style={{ margin: 0, fontSize: '0.88em', color: '#7a94a8' }}>Total</p>
          <p style={{ margin: 0, fontSize: '1.6em', fontWeight: 900, color: '#1a2e40' }}>${total.toFixed(2)} MXN</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary" onClick={vaciar}>🗑️ Vaciar</button>
          <button className="btn-primary" onClick={finalizarCompra} disabled={comprando}>
            {comprando ? 'Procesando...' : '✅ Finalizar compra'}
          </button>
        </div>
      </div>
    </section>
  );
}
