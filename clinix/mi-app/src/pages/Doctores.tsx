// ══════════════════════════════════════════════════════
//  pages/Doctores.tsx
// ══════════════════════════════════════════════════════

import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { doctoresService, Doctor } from '../services/api';
import Modal from '../components/Modal';
import Paginacion from '../components/Paginacion';

const ESPECIALIDADES = [
  'Medicina General','Cardiología','Neurología','Gastroenterología',
  'Neumología','Pediatría','Ginecología','Traumatología','Dermatología',
  'Oftalmología','Psiquiatría','Oncología','Urgencias',
];

interface FormDoctor {
  cedula: string;
  hospital_id: string;
  first_name: string;
  last_name: string;
  specialty: string;
  years_exp: string;
  phone: string;
  email: string;
  active: number;
}

const FORM_INICIAL: FormDoctor = {
  cedula: '', hospital_id: '', first_name: '', last_name: '',
  specialty: '', years_exp: '', phone: '', email: '', active: 1,
};

export default function Doctores() {
  const [page, setPage] = useState(1);
  const { data, loading, error, refetch } = useFetch(() =>
    doctoresService.getPaginated({ page, limit: 50 })
  , [page]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState<FormDoctor>(FORM_INICIAL);
  const [guardando, setGuardando] = useState(false);
  const [formError, setFormError] = useState('');

  function abrirModal() { setForm(FORM_INICIAL); setFormError(''); setModalAbierto(true); }
  function cerrarModal() { setModalAbierto(false); }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function guardar() {
    if (!form.cedula || !form.first_name || !form.last_name || !form.specialty || !form.hospital_id) {
      setFormError('Completa los campos obligatorios (*)');
      return;
    }
    setGuardando(true);
    setFormError('');
    try {
      await doctoresService.create({
        cedula: form.cedula,
        first_name: form.first_name,
        last_name: form.last_name,
        specialty: form.specialty,
        phone: form.phone || undefined,
        email: form.email || undefined,
        years_exp: form.years_exp ? Number(form.years_exp) : undefined,
        active: Number(form.active),
        hospitals_hospital_id: Number(form.hospital_id),
      });
      cerrarModal();
      refetch();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  }

  const resData: any = data;
  let lista: Doctor[] = Array.isArray(resData) ? resData : (resData?.data ?? resData?.items ?? []);
  let totalPaginas = resData?.totalPages ?? (resData?.total ? Math.ceil(resData.total / 50) : 1);

  if (Array.isArray(resData)) {
    totalPaginas = Math.ceil(lista.length / 50) || 1;
    lista = lista.slice((page - 1) * 50, page * 50);
  }

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2><b>Doctores Disponibles</b></h2>
          <p className="hospital-subtitulo">Consulta los médicos registrados en el sistema</p>
        </div>
        <button className="btn-primary" onClick={abrirModal}>＋ Agregar Doctor</button>
      </div>

      {loading && <p>Cargando doctores...</p>}
      {error   && <p className="error-txt">⚠️ {error}</p>}

      {!loading && !error && (
        <div className="hospitales-grid">
          {lista.length === 0 && <p>No hay doctores registrados.</p>}
          {lista.map((doc) => (
            <div key={doc.doctor_id} className="card-hosp">
              <div className="card-hosp-img card-doctor-img-bg" />
              <div className="card-hosp-info">
                <h3>{doc.first_name} {doc.last_name}</h3>
                <p className="card-hosp-location">🩺 {doc.specialty}</p>
                <p className="card-hosp-tipo">
                  {doc.years_exp ? `${doc.years_exp} años de experiencia` : 'Experiencia no especificada'}
                </p>
                <div className="card-hosp-footer">
                  <span style={{ fontSize: '0.8em', color: doc.active ? '#27ae60' : '#e74c3c', fontWeight: 700 }}>
                    {doc.active ? '✅ Activo' : '⛔ Inactivo'}
                  </span>
                  {doc.phone && <span style={{ fontSize: '0.8em' }}>📞 {doc.phone}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && lista.length > 0 && (
        <Paginacion paginaActual={page} totalPaginas={totalPaginas} cambiarPagina={setPage} />
      )}

      <Modal
        open={modalAbierto}
        onClose={cerrarModal}
        title="Registrar Doctor"
        subtitle="Completa los campos del médico"
        icon="👨‍⚕️"
        footer={
          <>
            <button className="modal-btn-cancelar" onClick={cerrarModal}>Cancelar</button>
            <button className="modal-btn-guardar" onClick={guardar} disabled={guardando}>
              {guardando ? 'Guardando...' : '💾 Guardar Doctor'}
            </button>
          </>
        }
      >
        {formError && <p className="error-txt" style={{ marginBottom: 12 }}>⚠️ {formError}</p>}

        <div className="modal-fila">
          <div className="modal-campo">
            <label>Cédula Profesional <span className="req">*</span></label>
            <input name="cedula" value={form.cedula} onChange={handleChange} placeholder="Ej. 12345678" maxLength={20} />
          </div>
          <div className="modal-campo">
            <label>ID Hospital <span className="req">*</span></label>
            <input name="hospital_id" type="number" value={form.hospital_id} onChange={handleChange} placeholder="ID del hospital" min={1} />
          </div>
        </div>

        <div className="modal-fila">
          <div className="modal-campo">
            <label>Nombre(s) <span className="req">*</span></label>
            <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="Ej. Carlos" maxLength={80} />
          </div>
          <div className="modal-campo">
            <label>Apellido(s) <span className="req">*</span></label>
            <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Ej. López Martínez" maxLength={80} />
          </div>
        </div>

        <div className="modal-fila">
          <div className="modal-campo">
            <label>Especialidad <span className="req">*</span></label>
            <select name="specialty" value={form.specialty} onChange={handleChange}>
              <option value="">— Selecciona —</option>
              {ESPECIALIDADES.map((e) => <option key={e}>{e}</option>)}
            </select>
          </div>
          <div className="modal-campo">
            <label>Años de experiencia</label>
            <input name="years_exp" type="number" value={form.years_exp} onChange={handleChange} placeholder="Ej. 10" min={0} max={60} />
          </div>
        </div>

        <div className="modal-fila">
          <div className="modal-campo">
            <label>Teléfono</label>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="8331234567" maxLength={20} />
          </div>
          <div className="modal-campo">
            <label>Correo electrónico</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="doctor@ejemplo.com" maxLength={120} />
          </div>
        </div>

        <div className="modal-fila">
          <div className="modal-campo modal-campo--full">
            <label>Estatus</label>
            <div className="toggle-grupo">
              {([{ val: 1, label: '✅ Activo' }, { val: 0, label: '⛔ Inactivo' }] as const).map(({ val, label }) => (
                <label key={val} className="toggle-opcion">
                  <input type="radio" name="active" value={val} checked={Number(form.active) === val} onChange={handleChange} />
                  <span className={`toggle-pill toggle-pill--${Number(form.active) === val ? 'activo' : 'inactivo'}`}>{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );
}
