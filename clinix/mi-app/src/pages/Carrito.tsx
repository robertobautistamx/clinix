// ══════════════════════════════════════════════════════
//  pages/Carrito.tsx
// ══════════════════════════════════════════════════════

import { useCarrito } from '../context/CarritoContext';
import { transaccionesService, pacientesService, doctoresService } from '../services/api';
import { useState, useEffect } from 'react';

export default function Carrito() {
  const { items, quitar, cambiarCantidad, vaciar, total, totalItems } = useCarrito();
  const [comprando, setComprando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [patientId, setPatientId] = useState<number | ''>('');
  const [busqueda, setBusqueda] = useState('');
  const [doctores, setDoctores] = useState<any[]>([]);
  const [doctorId, setDoctorId] = useState<number | ''>('');

  useEffect(() => {
    // Aumentamos el límite para traer suficientes pacientes a la memoria y poder filtrarlos
    pacientesService.getPaginated({ page: 1, limit: 1000 })
      .then((res: any) => {
        const lista = Array.isArray(res) ? res : (res.data ?? res.items ?? []);
        setPacientes(lista);
        if (lista.length > 0) {
          setPatientId(lista[0].patient_id); // Auto-seleccionar el primero
        }
      })
      .catch(err => console.error('Error al cargar pacientes', err));
      
    // Cargar doctores de la base de datos
    doctoresService.getPaginated({ page: 1, limit: 100 })
      .then((res: any) => {
        const lista = Array.isArray(res) ? res : (res.data ?? res.items ?? []);
        setDoctores(lista);
        if (lista.length > 0) {
          setDoctorId(lista[0].doctor_id); // Auto-seleccionar el primero
        }
      })
      .catch(err => console.error('Error al cargar doctores', err));
  }, []);

  // Filtramos localmente la lista de pacientes según lo que se escriba en el buscador
  // Agregamos .slice(0, 50) para no renderizar miles de elementos y evitar que se congele la pestaña
  const pacientesFiltrados = pacientes.filter(p => {
    const texto = `${p.first_name || ''} ${p.last_name || ''} ${p.curp || ''}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  }).slice(0, 50);

  // Calculamos el total real asegurando que la cantidad sea al menos 1 para evitar errores matemáticos
  const totalCalculado = items.reduce((acc, item) => {
    const p = Number((item as any).unit_price ?? item.price ?? 0);
    const q = Number(item.cantidad) || 1;
    return acc + (p * q);
  }, 0);

  async function finalizarCompra() {
    if (items.length === 0) return;
    if (!doctorId) {
      setMensaje('⚠️ Debes seleccionar un doctor para finalizar la compra.');
      return;
    }
    if (!patientId) {
      setMensaje('⚠️ Debes seleccionar un paciente para finalizar la compra.');
      return;
    }

    setComprando(true);
    setMensaje('');
    const transactionCode = `TXN-${Date.now()}`;
    try {
      for (const item of items) {
        await transaccionesService.create({
          total: totalCalculado,
          patient_id: Number(patientId),
          doctor_id: Number(doctorId),
          hospital_id: 1,
          product_id: item.product_id,
          diagnosis_id: 1, // Valor fijo para pruebas, asegúrate que exista en tu base
          quantity: Number(item.cantidad) || 1,
          unit_price: Number(item.price ?? 0),
          transaction_code: transactionCode,
        });
      }
      vaciar();
      setMensaje('✅ ¡Compra realizada con éxito!');
    } catch (err) {
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

      {mensaje && (
        <div style={{ padding: '12px 16px', background: mensaje.includes('✅') ? '#e8f8f5' : '#fee', color: mensaje.includes('✅') ? '#27ae60' : '#c33', borderRadius: 8, marginBottom: 16, fontWeight: 600 }}>
          {mensaje}
        </div>
      )}

      {items.map((item) => {
        const precioStr = (item as any).unit_price ?? item.price;
        const precioNum = precioStr != null ? Number(precioStr) : 0;
        const qty = Number(item.cantidad) || 1; // Protección visual
        
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
              <button className="qty-btn" onClick={() => cambiarCantidad(item.product_id, qty - 1)}>−</button>
              <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{qty}</span>
              <button className="qty-btn" onClick={() => cambiarCantidad(item.product_id, qty + 1)}>+</button>
            </div>

            <b style={{ minWidth: 70, textAlign: 'right' }}>
              ${(precioNum * qty).toFixed(2)}
            </b>

            <button className="btn-quitar" onClick={() => quitar(item.product_id)} title="Eliminar">✕</button>
          </div>
        );
      })}

      {/* Footer */}
      <div className="card" style={{ marginTop: 20 }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>Paciente:</label>
          <input
            type="text"
            placeholder="🔍 Buscar por nombre o CURP..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #ccc', fontSize: '1em', marginBottom: 8 }}
          />
          <select 
            value={patientId} 
            onChange={(e) => setPatientId(Number(e.target.value))}
            style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #ccc', fontSize: '1em' }}
          >
            <option value="">— Selecciona un paciente —</option>
            {pacientesFiltrados.map(p => (
              <option key={p.patient_id} value={p.patient_id}>
                {p.first_name} {p.last_name} ({p.curp})
              </option>
            ))}
          </select>
          {busqueda && pacientesFiltrados.length === 0 && (
            <p style={{ margin: '8px 0 0 0', fontSize: '0.85em', color: '#e74c3c' }}>No se encontraron pacientes.</p>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>Doctor que atiende:</label>
          <select 
            value={doctorId} 
            onChange={(e) => setDoctorId(Number(e.target.value))}
            style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #ccc', fontSize: '1em' }}
          >
            <option value="">— Selecciona un doctor —</option>
            {doctores.map(d => (
              <option key={d.doctor_id} value={d.doctor_id}>
                {d.first_name} {d.last_name} ({d.specialty})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ margin: 0, fontSize: '0.88em', color: '#7a94a8' }}>Total</p>
            <p style={{ margin: 0, fontSize: '1.6em', fontWeight: 900, color: '#1a2e40' }}>${totalCalculado.toFixed(2)} MXN</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-secondary" onClick={vaciar}>🗑️ Vaciar</button>
            <button className="btn-primary" onClick={finalizarCompra} disabled={comprando}>
              {comprando ? 'Procesando...' : '✅ Finalizar compra'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
