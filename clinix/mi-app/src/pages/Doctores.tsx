// ══════════════════════════════════════════════════════
//  pages/Doctores.tsx
// ══════════════════════════════════════════════════════

import { useState } from 'react';
import { Stethoscope, Check, X, Phone, Plus, Save, User } from 'lucide-react';
import { validateFields } from '../hooks/useValidator';
import DataTable from '../components/DataTable';
import { useFetch } from '../hooks/useFetch';
import { doctoresService, Doctor } from '../services/api';
import Modal from '../components/Modal';
import ValidationMessages from '../components/ValidationMessages';
import Paginacion from '../components/Paginacion';
import Loader from '../components/Loader';
import SearchBar from '../components/SearchBar';
import { useViewMode } from '../hooks/useViewMode';

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
  const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});
  const [busqueda, setBusqueda] = useState('');
  const [view, setView] = useViewMode('doctores');
  const [editingId, setEditingId] = useState<number | null>(null);

  function abrirModal() { setEditingId(null); setForm(FORM_INICIAL); setFormError(''); setModalAbierto(true); }
  function cerrarModal() { setModalAbierto(false); }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function guardar() {
    // Validación por campos
    const rules = {
      cedula: { required: true, message: 'Cédula requerida' },
      first_name: { required: true, message: 'Nombre requerido' },
      last_name: { required: true, message: 'Apellido requerido' },
      specialty: { required: true, message: 'Especialidad requerida' },
      hospital_id: { required: true, message: 'ID del hospital requerido' },
    };
    const { valid, errors } = validateFields(rules, form as any);
    if (!valid) {
      setFieldErrors(errors);
      setFormError('Corrige los campos marcados');
      return;
    }
    setGuardando(true);
    setFormError('');
    setFieldErrors({});
    try {
      const payload = {
        cedula: form.cedula,
        first_name: form.first_name,
        last_name: form.last_name,
        specialty: form.specialty,
        phone: form.phone || undefined,
        email: form.email || undefined,
        years_exp: form.years_exp ? Number(form.years_exp) : undefined,
        active: Number(form.active),
        hospitals_hospital_id: Number(form.hospital_id),
      } as any;
      if (editingId) {
        await doctoresService.update(editingId, payload);
      } else {
        await doctoresService.create(payload);
      }
      cerrarModal();
      setEditingId(null);
      refetch();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  }

  const handleEdit = (doc: Doctor) => {
    setEditingId(doc.doctor_id);
    setForm({
      cedula: doc.cedula ?? '',
      hospital_id: String((doc as any).hospitals_hospital_id ?? ''),
      first_name: doc.first_name ?? '',
      last_name: doc.last_name ?? '',
      specialty: doc.specialty ?? '',
      years_exp: doc.years_exp ? String(doc.years_exp) : '',
      phone: doc.phone ?? '',
      email: doc.email ?? '',
      active: doc.active ?? 1,
    });
    setFormError('');
    setModalAbierto(true);
  };

  const handleDelete = async (doc: Doctor) => {
    if (!window.confirm(`¿Eliminar al doctor ${doc.first_name} ${doc.last_name}?`)) return;
    try {
      await doctoresService.delete(doc.doctor_id);
      refetch();
      alert('Doctor eliminado');
    } catch (err: any) {
      alert('Error eliminando: ' + (err.message || err));
    }
  };

  const resData: any = data;
  let lista: Doctor[] = Array.isArray(resData) ? resData : (resData?.data ?? resData?.items ?? []);
  let totalPaginas = resData?.totalPages ?? (resData?.total ? Math.ceil(resData.total / 50) : 1);

  if (Array.isArray(resData)) {
    totalPaginas = Math.ceil(lista.length / 50) || 1;
    lista = lista.slice((page - 1) * 50, page * 50);
  }

  const listaFiltrada = lista.filter((doc) => {
    if (!busqueda) return true;
    const texto = `${doc.first_name} ${doc.last_name} ${doc.specialty} ${doc.cedula} ${doc.phone ?? ''}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2><b>Doctores Disponibles</b></h2>
              <p className="hospital-subtitulo">Consulta los médicos registrados en el sistema</p>
            </div>
            <button className="btn-primary" onClick={abrirModal}><Plus size={14} style={{ marginRight: 8 }} />Agregar Doctor</button>
          </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, marginRight: 12 }}>
          <SearchBar value={busqueda} onChange={setBusqueda} placeholder="Buscar por nombre, especialidad o cédula..." />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            style={{ padding: '8px 10px', borderRadius: 8, border: view === 'grid' ? '2px solid #3a7bd5' : '1px solid rgba(0,0,0,0.08)', background: view === 'grid' ? '#eaf3ff' : '#fff' }}
            onClick={() => setView('grid')}
          >
            Grid
          </button>
          <button
            style={{ padding: '8px 10px', borderRadius: 8, border: view === 'table' ? '2px solid #3a7bd5' : '1px solid rgba(0,0,0,0.08)', background: view === 'table' ? '#eaf3ff' : '#fff' }}
            onClick={() => setView('table')}
          >
            Tabla
          </button>
        </div>
      </div>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
          <Loader />
        </div>
      )}
      {error   && <p className="error-txt">{error}</p>}

      {!loading && !error && (
        <>
          {view === 'table' ? (
            <DataTable
              columns={[
                { key: 'name', label: 'Nombre', render: (_v, row) => `${row.first_name} ${row.last_name}` },
                { key: 'specialty', label: 'Especialidad' },
                { key: 'cedula', label: 'Cédula' },
                { key: 'phone', label: 'Teléfono' },
                { key: 'years_exp', label: 'Años', render: (_v, row) => (row.years_exp ?? '—') },
                { key: 'active', label: 'Estatus', render: (_v, row) => (row.active ? 'Activo' : 'Inactivo') },
              ]}
              data={listaFiltrada}
              onEdit={handleEdit}
              onDelete={handleDelete}
              showSearch={false}
            />
          ) : (
            <div className="hospitales-grid">
              {listaFiltrada.length === 0 && <p>No hay doctores que coincidan con la búsqueda.</p>}
              {listaFiltrada.map((doc) => (
                <div key={doc.doctor_id} className="card-hosp">
                  <div className="card-hosp-img card-doctor-img-bg">{<Stethoscope size={48} />}</div>
                  <div className="card-hosp-info">
                    <h3>{doc.first_name} {doc.last_name}</h3>
                    <p className="card-hosp-location"><Stethoscope size={14} style={{ marginRight: 8 }} />{doc.specialty}</p>
                    <p className="card-hosp-tipo">
                      {doc.years_exp ? `${doc.years_exp} años de experiencia` : 'Experiencia no especificada'}
                    </p>
                    <div className="card-hosp-footer">
                      <span style={{ fontSize: '0.8em', color: doc.active ? '#27ae60' : '#e74c3c', fontWeight: 700 }}>
                        {doc.active ? <><Check size={12} style={{ marginRight: 6 }} />Activo</> : <><X size={12} style={{ marginRight: 6 }} />Inactivo</>}
                      </span>
                      {doc.phone && <span style={{ fontSize: '0.8em' }}><Phone size={12} style={{ marginRight: 8 }} />{doc.phone}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!loading && !error && listaFiltrada.length > 0 && (
        <Paginacion paginaActual={page} totalPaginas={totalPaginas} cambiarPagina={setPage} />
      )}

      <Modal
        open={modalAbierto}
        onClose={cerrarModal}
        title="Registrar Doctor"
        subtitle="Completa los campos del médico"
        icon={<User size={20} />}
        footer={
          <>
            <button className="modal-btn-cancelar" onClick={cerrarModal}>Cancelar</button>
            <button className="modal-btn-guardar" onClick={guardar} disabled={guardando}>
              {guardando ? 'Guardando...' : <><Save size={14} style={{ marginRight: 8 }} />Guardar Doctor</>}
            </button>
          </>
        }
      >
        {formError && <p className="error-txt" style={{ marginBottom: 12 }}>{formError}</p>}

        <div className="modal-fila">
          <div className="modal-campo">
            <label>Cédula Profesional <span className="req">*</span></label>
            <input name="cedula" value={form.cedula} onChange={handleChange} placeholder="Ej. 12345678" maxLength={20} />
            <ValidationMessages field="cedula" errors={fieldErrors} />
          </div>
          <div className="modal-campo">
            <label>ID Hospital <span className="req">*</span></label>
            <input name="hospital_id" type="number" value={form.hospital_id} onChange={handleChange} placeholder="ID del hospital" min={1} />
            <ValidationMessages field="hospital_id" errors={fieldErrors} />
          </div>
        </div>

        <div className="modal-fila">
          <div className="modal-campo">
            <label>Nombre(s) <span className="req">*</span></label>
            <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="Ej. Carlos" maxLength={80} />
            <ValidationMessages field="first_name" errors={fieldErrors} />
          </div>
          <div className="modal-campo">
            <label>Apellido(s) <span className="req">*</span></label>
            <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Ej. López Martínez" maxLength={80} />
            <ValidationMessages field="last_name" errors={fieldErrors} />
          </div>
        </div>

        <div className="modal-fila">
          <div className="modal-campo">
            <label>Especialidad <span className="req">*</span></label>
            <select name="specialty" value={form.specialty} onChange={handleChange}>
              <option value="">— Selecciona —</option>
              {ESPECIALIDADES.map((e) => <option key={e}>{e}</option>)}
            </select>
            <ValidationMessages field="specialty" errors={fieldErrors} />
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
              {([{ val: 1, label: (<><Check size={12} style={{ marginRight: 6 }} />Activo</>) }, { val: 0, label: (<><X size={12} style={{ marginRight: 6 }} />Inactivo</>) }] as const).map(({ val, label }) => (
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
