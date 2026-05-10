import { useState } from 'react';
import { User, MapPin, Phone, Shield, AlertTriangle, Save, Plus, Stethoscope, Lightbulb } from 'lucide-react';
import DataTable from '../components/DataTable';
import { validateFields } from '../hooks/useValidator';
import { useFetch } from '../hooks/useFetch';
import { pacientesService, Paciente } from '../services/api';
import Modal from '../components/Modal';
import ValidationMessages from '../components/ValidationMessages';
import Paginacion from '../components/Paginacion';
import Loader from '../components/Loader';
import SearchBar from '../components/SearchBar';
import { useViewMode } from '../hooks/useViewMode';

interface FormPaciente {
  first_name: string; last_name: string; curp: string; birth_date: string;
  gender: 'M' | 'F'; blood_type: string; phone: string; email: string;
  city: string; state: string; address: string; weight_kg: string;
  height_cm: string; allergies: string; insurance_type: string;
  insurance_id: string; smoker: number; alcohol: number;
}

const FORM_INICIAL: FormPaciente = {
  first_name: '', last_name: '', curp: '', birth_date: '', gender: 'M',
  blood_type: '', phone: '', email: '', city: '', state: '', address: '',
  weight_kg: '', height_cm: '', allergies: '', insurance_type: '',
  insurance_id: '', smoker: 0, alcohol: 0,
};

function calcEdad(birth_date: string): string {
  if (!birth_date) return '';
  const diff = Date.now() - new Date(birth_date).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)) + ' años';
}

export default function Pacientes() {
  const [page, setPage] = useState(1);
  const { data, loading, error, refetch } = useFetch(() =>
    pacientesService.getPaginated({ page, limit: 50 })
  , [page]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState<FormPaciente>(FORM_INICIAL);
  const [guardando, setGuardando] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});
  const [busqueda, setBusqueda] = useState('');
  const [view, setView] = useViewMode('pacientes');
  const [editingId, setEditingId] = useState<number | null>(null);

  function abrirModal() { setEditingId(null); setForm(FORM_INICIAL); setFormError(''); setFieldErrors({}); setModalAbierto(true); }
  function cerrarModal() { setModalAbierto(false); }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function guardar() {
    const rules = {
      first_name: { required: true, message: 'Nombre requerido' },
      last_name: { required: true, message: 'Apellido requerido' },
      curp: { required: true, minLength: 18, message: 'CURP requerido (18 caracteres)' },
      birth_date: { required: true, message: 'Fecha de nacimiento requerida' },
      gender: { required: true, message: 'Género requerido' },
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
        first_name: form.first_name,
        last_name: form.last_name,
        curp: form.curp.toUpperCase(),
        birth_date: form.birth_date,
        gender: form.gender,
        blood_type: form.blood_type || undefined,
        phone: form.phone || undefined,
        email: form.email || undefined,
        city: form.city || undefined,
        state: form.state || undefined,
        address: form.address || undefined,
        weight_kg: form.weight_kg ? Number(form.weight_kg) : undefined,
        height_cm: form.height_cm ? Number(form.height_cm) : undefined,
        allergies: form.allergies || undefined,
        insurance_type: form.insurance_type || undefined,
        insurance_id: form.insurance_id || undefined,
        smoker: Number(form.smoker),
        alcohol: Number(form.alcohol),
      } as any;
      if (editingId) {
        await pacientesService.update(editingId, payload);
      } else {
        await pacientesService.create(payload);
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

  const handleEdit = (pac: Paciente) => {
    setEditingId(pac.patient_id);
    setForm({
      first_name: pac.first_name ?? '', last_name: pac.last_name ?? '', curp: pac.curp ?? '', birth_date: pac.birth_date ?? '',
      gender: pac.gender ?? 'M', blood_type: pac.blood_type ?? '', phone: pac.phone ?? '', email: pac.email ?? '',
      city: pac.city ?? '', state: pac.state ?? '', address: pac.address ?? '', weight_kg: pac.weight_kg ? String(pac.weight_kg) : '',
      height_cm: pac.height_cm ? String(pac.height_cm) : '', allergies: pac.allergies ?? '', insurance_type: pac.insurance_type ?? '',
      insurance_id: pac.insurance_id ?? '', smoker: pac.smoker ?? 0, alcohol: pac.alcohol ?? 0,
    });
    setFormError('');
    setModalAbierto(true);
  };

  const handleDelete = async (pac: Paciente) => {
    if (!window.confirm(`¿Eliminar al paciente ${pac.first_name} ${pac.last_name}?`)) return;
    try {
      await pacientesService.delete(pac.patient_id);
      refetch();
      alert('Paciente eliminado');
    } catch (err: any) {
      alert('Error eliminando: ' + (err.message || err));
    }
  };

  const resData: any = data;
  let lista: Paciente[] = Array.isArray(resData) ? resData : (resData?.data ?? resData?.items ?? []);
  let totalPaginas = resData?.totalPages ?? (resData?.total ? Math.ceil(resData.total / 50) : 1);

  if (Array.isArray(resData)) {
    totalPaginas = Math.ceil(lista.length / 50) || 1;
    lista = lista.slice((page - 1) * 50, page * 50);
  }

  const listaFiltrada = lista.filter((pac) => {
    if (!busqueda) return true;
    const texto = `${pac.first_name} ${pac.last_name} ${pac.curp} ${pac.city ?? ''} ${pac.phone ?? ''}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2><b>Pacientes Registrados</b></h2>
              <p className="hospital-subtitulo">Consulta y administra los pacientes del sistema</p>
            </div>
            <button className="btn-primary btn-primary--green" onClick={abrirModal}><Plus size={14} style={{ marginRight: 8 }} />Agregar Paciente</button>
          </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, marginRight: 12 }}>
          <SearchBar value={busqueda} onChange={setBusqueda} placeholder="Buscar por nombre, CURP o ciudad..." />
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
                { key: 'curp', label: 'CURP' },
                { key: 'birth_date', label: 'Edad', render: (_v, row) => calcEdad(row.birth_date) },
                { key: 'gender', label: 'Género' },
                { key: 'city', label: 'Ciudad' },
                { key: 'phone', label: 'Teléfono' },
              ]}
              data={listaFiltrada}
              onEdit={handleEdit}
              onDelete={handleDelete}
              showSearch={false}
            />
          ) : (
            <div className="hospitales-grid">
              {listaFiltrada.length === 0 && <p>No hay pacientes que coincidan con la búsqueda.</p>}
              {listaFiltrada.map((pac) => (
                <div key={pac.patient_id} className="card-hosp">
                  <div className="card-hosp-img" style={{
                    background: 'linear-gradient(135deg,#27ae60,#2ecc71)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3em',
                  }}>
                    <User size={48} />
                    <span className="card-pac-genero">{pac.gender === 'F' ? 'Femenino' : 'Masculino'}</span>
                  </div>
                  <div className="card-hosp-info">
                    <h3>{pac.first_name} {pac.last_name}</h3>
                    <p className="card-hosp-location">CURP: {pac.curp}</p>
                    <p className="card-hosp-tipo">
                      {calcEdad(pac.birth_date)}{pac.blood_type ? ` · Tipo ${pac.blood_type}` : ''}
                    </p>
                    <div className="card-pac-datos">
                      {pac.city            && <span className="card-pac-chip"><MapPin size={12} style={{ marginRight: 6 }} />{pac.city}</span>}
                      {pac.phone           && <span className="card-pac-chip"><Phone size={12} style={{ marginRight: 6 }} />{pac.phone}</span>}
                      {pac.insurance_type  && <span className="card-pac-chip"><Shield size={12} style={{ marginRight: 6 }} />{pac.insurance_type}</span>}
                      {pac.allergies       && <span className="card-pac-chip card-pac-chip--alerta"><AlertTriangle size={12} style={{ marginRight: 6 }} />Alergias</span>}
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
        title="Registrar Paciente"
        subtitle="Completa los datos del paciente"
        icon={<User size={20} />}
        wide
        footer={
          <>
            <button className="modal-btn-cancelar" onClick={cerrarModal}>Cancelar</button>
            <button className="modal-btn-guardar" onClick={guardar} disabled={guardando}>
              {guardando ? 'Guardando...' : <><Save size={14} style={{ marginRight: 8 }} />Guardar Paciente</>}
            </button>
          </>
        }
      >
        {formError && <p className="error-txt" style={{ marginBottom: 12 }}>{formError}</p>}

        <p className="modal-seccion-titulo">Datos Personales</p>
        <div className="modal-fila">
          <div className="modal-campo"><label>Nombre(s) <span className="req">*</span></label>
            <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="Ej. Juan" maxLength={80} />
            <ValidationMessages field="first_name" errors={fieldErrors} />
          </div>
          <div className="modal-campo"><label>Apellido(s) <span className="req">*</span></label>
            <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Ej. Pérez García" maxLength={80} />
            <ValidationMessages field="last_name" errors={fieldErrors} />
          </div>
        </div>
        <div className="modal-fila">
          <div className="modal-campo"><label>CURP <span className="req">*</span></label>
            <input name="curp" value={form.curp} onChange={handleChange} placeholder="PEGJ900101HTCRRN01" maxLength={18} style={{ textTransform: 'uppercase' }} />
            <ValidationMessages field="curp" errors={fieldErrors} />
          </div>
          <div className="modal-campo"><label>Fecha de nacimiento <span className="req">*</span></label>
            <input name="birth_date" type="date" value={form.birth_date} onChange={handleChange} />
            <ValidationMessages field="birth_date" errors={fieldErrors} />
          </div>
        </div>
        <div className="modal-fila">
          <div className="modal-campo">
            <label>Género <span className="req">*</span></label>
            <div className="toggle-grupo">
              {(['M','F'] as const).map((g) => (
                <label key={g} className="toggle-opcion">
                  <input type="radio" name="gender" value={g} checked={form.gender === g} onChange={handleChange} />
                  <span className={`toggle-pill toggle-pill--${form.gender === g ? 'activo' : 'inactivo'}`}>
                    {g === 'M' ? '♂ Masculino' : '♀ Femenino'}
                  </span>
                </label>
              ))}
            </div>
            <ValidationMessages field="gender" errors={fieldErrors} />
          </div>
          <div className="modal-campo"><label>Tipo de sangre</label>
            <select name="blood_type" value={form.blood_type} onChange={handleChange}>
              <option value="">— Selecciona —</option>
              {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <p className="modal-seccion-titulo">Contacto y Ubicación</p>
        <div className="modal-fila">
          <div className="modal-campo"><label>Teléfono</label>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="8331234567" maxLength={20} />
          </div>
          <div className="modal-campo"><label>Correo electrónico</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="paciente@ejemplo.com" maxLength={120} />
          </div>
        </div>
        <div className="modal-fila">
          <div className="modal-campo"><label>Ciudad</label>
            <input name="city" value={form.city} onChange={handleChange} placeholder="Ciudad Madero" maxLength={80} />
          </div>
          <div className="modal-campo"><label>Estado</label>
            <input name="state" value={form.state} onChange={handleChange} placeholder="Tamaulipas" maxLength={60} />
          </div>
        </div>
        <div className="modal-fila">
          <div className="modal-campo modal-campo--full"><label>Dirección</label>
            <input name="address" value={form.address} onChange={handleChange} placeholder="Calle Reforma 123, Col. Centro" maxLength={200} />
          </div>
        </div>

        <p className="modal-seccion-titulo">Datos Médicos</p>
        <div className="modal-fila">
          <div className="modal-campo"><label>Peso (kg)</label>
            <input name="weight_kg" type="number" value={form.weight_kg} onChange={handleChange} placeholder="70.5" min={1} max={300} step={0.01} />
          </div>
          <div className="modal-campo"><label>Altura (cm)</label>
            <input name="height_cm" type="number" value={form.height_cm} onChange={handleChange} placeholder="175" min={50} max={250} />
          </div>
        </div>
        <div className="modal-fila">
          <div className="modal-campo modal-campo--full"><label>Alergias</label>
            <textarea name="allergies" value={form.allergies} onChange={handleChange} placeholder="Ej. Penicilina, Polen... (vacío si ninguna)" rows={2} />
          </div>
        </div>

        <p className="modal-seccion-titulo">Seguro Médico</p>
        <div className="modal-fila">
          <div className="modal-campo"><label>Tipo de seguro</label>
            <select name="insurance_type" value={form.insurance_type} onChange={handleChange}>
              <option value="">— Sin seguro —</option>
              {[['IMSS','IMSS'],['ISSS','ISSSTE'],['PRIV','Privado'],['SEGP','Seguro Popular'],['BIEN','Bienestar']].map(([v,l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div className="modal-campo"><label>No. de afiliación / ID seguro</label>
            <input name="insurance_id" value={form.insurance_id} onChange={handleChange} placeholder="12345678901" maxLength={20} />
          </div>
        </div>

        <p className="modal-seccion-titulo">Hábitos</p>
        <div className="modal-fila">
          {(['smoker','alcohol'] as const).map((campo) => (
            <div key={campo} className="modal-campo">
              <label>{campo === 'smoker' ? '¿Fuma?' : '¿Consume alcohol?'}</label>
              <div className="toggle-grupo">
                {[{ val: 0, label: 'No' }, { val: 1, label: 'Sí' }].map(({ val, label }) => (
                  <label key={val} className="toggle-opcion">
                    <input type="radio" name={campo} value={val} checked={Number(form[campo]) === val} onChange={handleChange} />
                    <span className={`toggle-pill toggle-pill--${Number(form[campo]) === val ? 'activo' : 'inactivo'}`}>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </section>
  );
}
