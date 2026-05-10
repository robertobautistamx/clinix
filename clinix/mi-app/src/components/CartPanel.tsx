import React, { useEffect, useState } from 'react';
import { useCarrito } from '../context/CarritoContext';
import { X, Trash2, Plus, Minus, Check, AlertTriangle } from 'lucide-react';
import { transaccionesService, pacientesService, doctoresService, hospitalesService, diagnosticosService } from '../services/api';
import Modal from './Modal';
import Loader from './Loader';

export default function CartPanel() {
  const { items, cambiarCantidad, quitar, vaciar, total, totalItems, isOpen, cerrarCarrito } = useCarrito();

  const [comprando, setComprando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const [pacientes, setPacientes] = useState<any[]>([]);
  const [patientId, setPatientId] = useState<number | ''>('');
  const [doctores, setDoctores] = useState<any[]>([]);
  const [doctorId, setDoctorId] = useState<number | ''>('');
  const [hospitales, setHospitales] = useState<any[]>([]);
  const [hospitalId, setHospitalId] = useState<number | ''>('');
  const [diagnosticos, setDiagnosticos] = useState<any[]>([]);
  const [diagnosisId, setDiagnosisId] = useState<number | ''>('');

  useEffect(() => {
    if (!isOpen) return;
    // bloquear scroll del body
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  useEffect(() => {
    // cargar datos necesarios para checkout
    pacientesService.getPaginated({ page: 1, limit: 200 })
      .then((res: any) => {
        const lista = Array.isArray(res) ? res : (res.data ?? res.items ?? []);
        setPacientes(lista);
        if (lista.length > 0) setPatientId(lista[0].patient_id);
      }).catch(() => {});

    doctoresService.getPaginated({ page: 1, limit: 200 })
      .then((res: any) => {
        const lista = Array.isArray(res) ? res : (res.data ?? res.items ?? []);
        setDoctores(lista);
        if (lista.length > 0) setDoctorId(lista[0].doctor_id);
      }).catch(() => {});

    hospitalesService.getPaginated({ page: 1, limit: 200 })
      .then((res: any) => {
        const lista = Array.isArray(res) ? res : (res.data ?? res.items ?? []);
        setHospitales(lista);
        if (lista.length > 0) setHospitalId(lista[0].hospital_id);
      }).catch(() => {});

    diagnosticosService.getAll()
      .then((lista: any) => {
        if (Array.isArray(lista) && lista.length > 0) {
          setDiagnosticos(lista);
          setDiagnosisId(lista[0].diagnosis_id);
        }
      }).catch(() => {});
  }, [isOpen]);

  // calcular precios con fallback robusto
  function getUnitPrice(it: any) {
    const p = it.price ?? it.unit_price ?? (it as any).unitPrice ?? (it as any).precio ?? 0;
    return Number(p) || 0;
  }

  async function finalizarCompra() {
    if (items.length === 0) return;
    if (!doctorId) { setMensaje('Selecciona un doctor'); return; }
    if (!patientId) { setMensaje('Selecciona un paciente'); return; }
    if (!hospitalId) { setMensaje('Selecciona un hospital'); return; }
    if (!diagnosisId) { setMensaje('Selecciona un diagnóstico'); return; }

    setComprando(true);
    setMensaje('');
    const transactionCode = `TXN-${Date.now()}`;
    try {
      for (const item of items) {
        const unitPrice = getUnitPrice(item);
        const qty = Number(item.cantidad) || 1;
        const subtotal = unitPrice * qty;
        const taxPct = 16;
        const taxAmount = Number((subtotal * taxPct / 100).toFixed(2));
        const totalAmount = Number((subtotal + taxAmount).toFixed(2));
        await transaccionesService.create({
          total: totalAmount,
          total_amount: totalAmount,
          patient_id: Number(patientId),
          doctor_id: Number(doctorId),
          hospital_id: Number(hospitalId),
          product_id: item.product_id,
          diagnosis_id: Number(diagnosisId),
          quantity: qty,
          unit_price: unitPrice,
          discount_pct: 0,
          discount_amount: 0,
          subtotal,
          tax_pct: taxPct,
          tax_amount: taxAmount,
          currency: 'MXN',
          payment_method: 'EFECTIVO',
          insurance_covered: 0,
          patient_paid: totalAmount,
          status: 'COMPLETADA',
          transaction_type: 'SALE',
          transaction_date: new Date().toISOString(),
          transaction_code: transactionCode,
        });
      }
      vaciar();
      setMensaje('Compra realizada con éxito');
    } catch (err: any) {
      setMensaje(err?.message || 'Error al procesar la compra');
    } finally {
      setComprando(false);
    }
  }

  return (
    <>
      <Modal open={comprando || !!mensaje} onClose={() => { if (!comprando) setMensaje(''); }} title={comprando ? 'Procesando compra' : undefined}>
        {comprando ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24 }}>
            <Loader />
            <p style={{ marginTop: 18, fontWeight: 700 }}>Procesando compra...</p>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0 10px 0' }}>
            <style>{`
              @keyframes scaleCheck {
                0% { transform: scale(0); opacity: 0; }
                50% { transform: scale(1.2); opacity: 1; }
                100% { transform: scale(1); }
              }
              @keyframes fadeInUp {
                to { opacity: 1; transform: translateY(0); }
              }
              .success-anim-icon {
                animation: scaleCheck 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                display: inline-flex; align-items: center; justify-content: center;
                width: 72px; height: 72px; border-radius: 50%;
                background: #eafaf1; margin: 0 auto 16px auto;
              }
              .error-anim-icon {
                animation: scaleCheck 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                display: inline-flex; align-items: center; justify-content: center;
                width: 72px; height: 72px; border-radius: 50%;
                background: #fdecea; margin: 0 auto 16px auto;
              }
              .anim-text {
                animation: fadeInUp 0.4s ease forwards 0.1s;
                opacity: 0; transform: translateY(10px);
              }
            `}</style>
            <div className={mensaje.toLowerCase().includes('éxito') ? "success-anim-icon" : "error-anim-icon"}>
              {mensaje.toLowerCase().includes('éxito') ? <Check size={40} color="#27ae60" strokeWidth={3} /> : <AlertTriangle size={40} color="#e74c3c" strokeWidth={3} />}
            </div>
            <h3 className="anim-text" style={{ fontSize: '1.3em', color: mensaje.toLowerCase().includes('éxito') ? '#27ae60' : '#e74c3c', margin: '0 0 8px 0' }}>
              {mensaje.toLowerCase().includes('éxito') ? '¡Éxito!' : 'Atención'}
            </h3>
            <p className="anim-text" style={{ fontSize: '1.1em', fontWeight: 500, color: '#1a2e40', margin: 0 }}>{mensaje}</p>
          </div>
        )}
      </Modal>

      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={() => cerrarCarrito()} />
      <aside className={`cart-panel ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
        <div className="cart-panel-header">
          <h3>Tu carrito</h3>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="cart-count">{totalItems}</span>
            <button className="icon-btn" onClick={() => cerrarCarrito()} aria-label="Cerrar carrito"><X size={18} /></button>
          </div>
        </div>

        <div className="cart-panel-body">
          {items.length === 0 ? (
            <p style={{ color: '#7a94a8' }}>Tu carrito está vacío.</p>
          ) : (
            items.map((it) => (
              <div key={it.product_id} className="cart-item">
                <div className="cart-item-info">
                  <div className="cart-item-name">{it.name}</div>
                  <div className="cart-item-meta">${getUnitPrice(it).toFixed(2)} MXN · {it.cantidad} uds</div>
                </div>
                <div className="cart-item-actions">
                  <div className="qty-controls">
                    <button className="icon-btn" onClick={() => cambiarCantidad(it.product_id, it.cantidad - 1)} aria-label="Disminuir"><Minus size={14} /></button>
                    <span className="qty">{it.cantidad}</span>
                    <button className="icon-btn" onClick={() => cambiarCantidad(it.product_id, it.cantidad + 1)} aria-label="Aumentar"><Plus size={14} /></button>
                  </div>
                  <button className="icon-btn danger" onClick={() => quitar(it.product_id)} title="Eliminar"><Trash2 size={16} /></button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-panel-footer">
          <div style={{ display: 'grid', gap: 8 }}>
            <label style={{ fontWeight: 700 }}>Doctor que atiende:</label>
            <select value={doctorId} onChange={(e) => setDoctorId(Number(e.target.value))} style={{ padding: 10, borderRadius: 8 }}>
              <option value="">— Selecciona un doctor —</option>
              {doctores.map(d => <option key={d.doctor_id} value={d.doctor_id}>{d.first_name} {d.last_name} ({d.specialty})</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.88em', color: '#7a94a8' }}>Total</p>
              <p style={{ margin: 0, fontSize: '1.1em', fontWeight: 900, color: '#1a2e40' }}>${total.toFixed(2)} MXN</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-secondary" onClick={() => vaciar()}><Trash2 size={14} style={{ marginRight: 8 }} />Vaciar</button>
              <button className="btn-primary" onClick={finalizarCompra} disabled={comprando}>{comprando ? 'Procesando...' : 'Finalizar compra'}</button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
