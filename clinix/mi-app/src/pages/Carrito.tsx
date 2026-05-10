// ══════════════════════════════════════════════════════
//  pages/Carrito.tsx
// ══════════════════════════════════════════════════════

import { useCarrito } from '../context/CarritoContext';
import { transaccionesService, pacientesService, doctoresService, hospitalesService, diagnosticosService } from '../services/api';
import { useState, useEffect } from 'react';
import { ShoppingCart, Pill, Trash2, Check, X } from 'lucide-react';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import React from 'react';

export default function Carrito() {
  const { items, quitar, cambiarCantidad, vaciar, totalItems } = useCarrito();
  const [comprando, setComprando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [patientId, setPatientId] = useState<number | ''>('');
  const [doctores, setDoctores] = useState<any[]>([]);
  const [doctorId, setDoctorId] = useState<number | ''>('');
  const [hospitalId, setHospitalId] = useState<number | ''>('');
  const [diagnosisId, setDiagnosisId] = useState<number | ''>('');

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

    // Cargar hospitales
    hospitalesService.getPaginated({ page: 1, limit: 50 })
      .then((res: any) => {
        const lista = Array.isArray(res) ? res : (res.data ?? res.items ?? []);
        if (lista.length > 0) {
          setHospitalId(lista[0].hospital_id);
        }
      })
      .catch(err => console.error('Error al cargar hospitales', err));

    // Cargar diagnosticos ICD10
    diagnosticosService.getAll()
      .then((lista: any) => {
        if (Array.isArray(lista) && lista.length > 0) {
          setDiagnosisId(lista[0].diagnosis_id);
        }
      })
      .catch(err => console.error('Error al cargar diagnosticos', err));
  }, []);

  // Calculamos el total real asegurando que la cantidad sea al menos 1 para evitar errores matemáticos
  const totalCalculado = items.reduce((acc, item) => {
    const p = Number((item as any).unit_price ?? item.price ?? 0);
    const q = Number(item.cantidad) || 1;
    return acc + (p * q);
  }, 0);

  const esExito = (mensaje: string) => {
    if (!mensaje) return false;
    const m = mensaje.toLowerCase();
    return m.includes('compra realizada') || m.includes('éxito') || m.includes('exito');
  };

  async function finalizarCompra() {
    if (items.length === 0) return;
    if (!doctorId) {
      setMensaje('Debes seleccionar un doctor para finalizar la compra.');
      return;
    }
    if (!patientId) {
      setMensaje('No hay pacientes disponibles. Registra al menos uno.');
      return;
    }
    if (!hospitalId) {
      setMensaje('No hay hospitales disponibles. Registra al menos uno.');
      return;
    }
    if (!diagnosisId) {
      setMensaje('No hay diagnósticos disponibles. Registra al menos uno.');
      return;
    }

    setComprando(true);
    setMensaje('');
    const transactionCode = `TXN-${Date.now()}`;
    try {
      for (const item of items) {
        const unitPrice = Number(item.price ?? (item as any).unit_price ?? 0);
        const qty = Number(item.cantidad) || 1;
        const subtotal = unitPrice * qty;
        const discountPct = 0;
        const discountAmount = 0;
        const taxPct = 16;
        const taxAmount = Number((subtotal * taxPct / 100).toFixed(2));
        const totalAmount = Number((subtotal - discountAmount + taxAmount).toFixed(2));
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
          discount_pct: discountPct,
          discount_amount: discountAmount,
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
    } catch (err) {
      setMensaje((err instanceof Error ? err.message : 'Error al procesar'));
    } finally {
      setComprando(false);
    }
  }



  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalIcon, setModalIcon] = useState<React.ReactNode>(null);


  // Mostrar modal de loader SOLO con el texto y loader animado
  useEffect(() => {
    if (comprando) {
      setModalTitle('Procesando compra');
      setModalIcon(null);
      setModalContent(
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'24px 0'}}>
          <Loader />
          <p style={{marginTop:18, fontWeight:600, color:'#1a2e40', fontSize:'1.1em'}}>Por favor espera un momento...</p>
        </div>
      );
      setModalOpen(true);
    } else {
      setModalOpen(false);
    }
  }, [comprando]);

  // Mostrar modal de mensaje de éxito/error
  useEffect(() => {
    if (mensaje && !comprando) {
      setModalTitle(esExito(mensaje) ? '¡Éxito!' : 'Aviso');
      setModalIcon(esExito(mensaje)
        ? <Check size={40} color="#27ae60" />
        : <X size={40} color="#e74c3c" />);
      setModalContent(<p style={{textAlign:'center',fontWeight:600}}>{mensaje}</p>);
      setModalOpen(true);
    }
  }, [mensaje, comprando]);

  if (items.length === 0) {
    return (
      <>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={modalTitle}
          icon={modalIcon}
        >
          {modalContent}
        </Modal>
        <section>
          <h2><b>Carrito</b></h2>
          {mensaje && <p style={{ color: '#27ae60', fontWeight: 700 }}>{mensaje}</p>}
          <div className="card" style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}><ShoppingCart size={64} /></div>
            <p>Tu carrito está vacío. Agrega productos desde la sección <b>Productos</b>.</p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        icon={modalIcon}
      >
        {modalContent}
      </Modal>
      <section>
        <h2><b>Carrito</b></h2>
        <p className="hospital-subtitulo">{totalItems} producto(s) en tu carrito</p>
        {items.map((item) => {
          const precioStr = (item as any).unit_price ?? item.price;
          const precioNum = precioStr != null ? Number(precioStr) : 0;
          const qty = Number(item.cantidad) || 1;
          return (
            <div key={item.product_id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <span style={{ display: 'flex', alignItems: 'center' }}><Pill size={28} /></span>
              <div style={{ flex: 1 }}>
                <b>{item.name}</b>
                <p style={{ margin: 0, fontSize: '0.88em', color: '#7a94a8' }}>
                  ${precioStr != null ? precioNum.toFixed(2) : '—'} MXN c/u
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button className="qty-btn" onClick={() => cambiarCantidad(item.product_id, qty - 1)}>−</button>
                <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{qty}</span>
                <button className="qty-btn" onClick={() => cambiarCantidad(item.product_id, qty + 1)}>+</button>
              </div>
              <b style={{ minWidth: 70, textAlign: 'right' }}>
                ${(precioNum * qty).toFixed(2)}
              </b>
              <button className="btn-quitar" onClick={() => quitar(item.product_id)} title="Eliminar">{React.createElement(X, { size: 14 })}</button>
            </div>
          );
        })}
        <div className="card" style={{ marginTop: 20 }}>
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
              <button className="btn-secondary" onClick={vaciar}><Trash2 size={14} style={{ marginRight: 8 }} />Vaciar</button>
              <button className="btn-primary" onClick={finalizarCompra} disabled={comprando}>
                {comprando ? 'Procesando...' : <><Check size={14} style={{ marginRight: 8 }} />Finalizar compra</>}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
