// ══════════════════════════════════════════════════════
//  pages/Hospital.tsx
// ══════════════════════════════════════════════════════

import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { hospitalesService, Hospital as HospitalType } from '../services/api';
import Paginacion from '../components/Paginacion';
import { Hospital as HospitalIcon, MapPin, Phone, Map, Plus, Save, Building } from 'lucide-react';
import Loader from '../components/Loader';
import SearchBar from '../components/SearchBar';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ValidationMessages from '../components/ValidationMessages';
import { validateFields } from '../hooks/useValidator';
import { useViewMode } from '../hooks/useViewMode';

interface FormHospital {
  name: string;
  city: string;
  state: string;
  address: string;
  phone: string;
}

const FORM_INICIAL: FormHospital = {
  name: '', city: '', state: '', address: '', phone: ''
};

function irHospital(query: string) {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export default function Hospital() {
  const [page, setPage] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const [view, setView] = useViewMode('hospital');
  const { data, loading, error, refetch } = useFetch(() =>
    hospitalesService.getPaginated({ page, limit: 50 })
  , [page]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState<FormHospital>(FORM_INICIAL);
  const [guardando, setGuardando] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  const resData: any = data;
  let lista: HospitalType[] = Array.isArray(resData) ? resData : (resData?.data ?? resData?.items ?? []);
  let totalPaginas = resData?.totalPages ?? (resData?.total ? Math.ceil(resData.total / 50) : 1);

  if (Array.isArray(resData)) {
    totalPaginas = Math.ceil(lista.length / 50) || 1;
    lista = lista.slice((page - 1) * 50, page * 50);
  }

  const listaFiltrada = lista.filter((hosp) => {
    if (!busqueda) return true;
    const texto = `${hosp.name} ${hosp.city ?? ''} ${hosp.state ?? ''} ${hosp.address ?? ''}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  function abrirModal() { setEditingId(null); setForm(FORM_INICIAL); setFormError(''); setFieldErrors({}); setModalAbierto(true); }
  function cerrarModal() { setModalAbierto(false); }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function guardar() {
    const rules = {
      name: { required: true, message: 'El nombre es requerido' },
      city: { required: true, message: 'La ciudad es requerida' },
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
        name: form.name,
        city: form.city,
        state: form.state || undefined,
        address: form.address || undefined,
        phone: form.phone || undefined,
      } as any;
      if (editingId) {
        await hospitalesService.update(editingId, payload);
      } else {
        await hospitalesService.create(payload);
      }
      cerrarModal();
      setEditingId(null);
      refetch();
    } catch (err: any) {
      setFormError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  }

  const handleEdit = (hosp: HospitalType) => {
    setEditingId(hosp.hospital_id);
    setForm({
      name: hosp.name ?? '',
      city: hosp.city ?? '',
      state: hosp.state ?? '',
      address: hosp.address ?? '',
      phone: hosp.phone ?? '',
    });
    setFormError('');
    setFieldErrors({});
    setModalAbierto(true);
  };

  const handleDelete = async (hosp: HospitalType) => {
    if (!window.confirm(`¿Eliminar al hospital ${hosp.name}?`)) return;
    try {
      await hospitalesService.delete(hosp.hospital_id);
      refetch();
    } catch (err: any) {
      alert('Error eliminando: ' + (err.message || err));
    }
  };

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2><b>Hospitales Cercanos</b></h2>
          <p className="hospital-subtitulo">Selecciona un hospital para obtener cómo llegar</p>
        </div>
        <button className="btn-primary" onClick={abrirModal}><Plus size={14} style={{ marginRight: 8 }} />Agregar Hospital</button>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, marginRight: 12 }}>
          <SearchBar value={busqueda} onChange={setBusqueda} placeholder="Buscar por nombre, ciudad o estado..." />
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
                { key: 'name', label: 'Nombre' },
                { key: 'city', label: 'Ciudad' },
                { key: 'state', label: 'Estado' },
                { key: 'address', label: 'Dirección', width: '40%' },
                { key: 'phone', label: 'Teléfono' },
                { key: 'maps', label: ' ', render: (_v, row) => (
                    <button className="datatable-btn ghost" onClick={() => irHospital(`${row.name}, ${row.city || ''}, ${row.state || ''}, ${row.address || ''}`)}>
                      Cómo llegar
                    </button>
                  ) },
              ]}
              data={listaFiltrada}
              onEdit={handleEdit}
              onDelete={handleDelete}
              showSearch={false}
            />
          ) : (
            <div className="hospitales-grid">
              {listaFiltrada.length === 0 && <p>No hay hospitales que coincidan con la búsqueda.</p>}
              {listaFiltrada.map((h) => (
                <div key={h.hospital_id} className="card-hosp" onClick={() => irHospital(`${h.name}, ${h.city || ''}, ${h.state || ''}`)}>
                  <div className="card-hosp-img" style={{ background: 'linear-gradient(135deg,#3a7bd5,#5a9bf5)' }}>
                    <span className="card-hosp-badge" style={{ background: 'rgba(255,255,255,0.92)', color: '#3a7bd5' }}>
                      {React.createElement(HospitalIcon, { size: 14, style: { marginRight: 8 } })} Hospital
                    </span>
                  </div>
                  <div className="card-hosp-info">
                    <h3>{h.name}</h3>
                    <p className="card-hosp-location"><MapPin size={12} style={{ marginRight: 8 }} />{h.city || 'Ciudad no especificada'}{h.state ? `, ${h.state}` : ''}</p>
                    <p className="card-hosp-tipo">{h.address || 'Dirección no especificada'}</p>
                    <div className="card-hosp-footer">
                      {h.phone && <span style={{ fontSize: '0.85em', color: '#7a94a8' }}><Phone size={12} style={{ marginRight: 8 }} />{h.phone}</span>}
                      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span className="card-hosp-maps">{React.createElement(Map, { size: 14, style: { marginRight: 8 } })} Cómo llegar</span>
                        <span className="card-hosp-arrow">→</span>
                      </div>
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
        title={editingId ? "Editar Hospital" : "Registrar Hospital"}
        subtitle="Completa los datos del hospital"
        icon={<Building size={20} />}
        footer={
          <>
            <button className="modal-btn-cancelar" onClick={cerrarModal}>Cancelar</button>
            <button className="modal-btn-guardar" onClick={guardar} disabled={guardando}>
              {guardando ? 'Guardando...' : <><Save size={14} style={{ marginRight: 8 }} />{editingId ? 'Actualizar' : 'Guardar'}</>}
            </button>
          </>
        }
      >
        {formError && <p className="error-txt" style={{ marginBottom: 12 }}>{formError}</p>}
        <div className="modal-fila">
          <div className="modal-campo modal-campo--full">
            <label>Nombre del Hospital <span className="req">*</span></label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Ej. Hospital General" />
            <ValidationMessages field="name" errors={fieldErrors} />
          </div>
        </div>
        <div className="modal-fila">
          <div className="modal-campo">
            <label>Ciudad <span className="req">*</span></label>
            <input name="city" value={form.city} onChange={handleChange} placeholder="Ej. Tampico" />
            <ValidationMessages field="city" errors={fieldErrors} />
          </div>
          <div className="modal-campo">
            <label>Estado</label>
            <input name="state" value={form.state} onChange={handleChange} placeholder="Ej. Tamaulipas" />
          </div>
        </div>
        <div className="modal-fila">
          <div className="modal-campo">
            <label>Teléfono</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Ej. 833 123 4567" />
          </div>
          <div className="modal-campo">
            <label>Dirección</label>
            <input name="address" value={form.address} onChange={handleChange} placeholder="Calle y número" />
          </div>
        </div>
      </Modal>
    </section>
  );
}
