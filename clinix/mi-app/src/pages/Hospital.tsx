// ══════════════════════════════════════════════════════
//  pages/Hospital.tsx
// ══════════════════════════════════════════════════════

import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { hospitalesService, Hospital as HospitalType } from '../services/api';
import Paginacion from '../components/Paginacion';
import { Hospital as HospitalIcon, MapPin, Phone, Map } from 'lucide-react';
import Loader from '../components/Loader';
import SearchBar from '../components/SearchBar';

function irHospital(query: string) {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export default function Hospital() {
  const [page, setPage] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const { data, loading, error } = useFetch(() =>
    hospitalesService.getPaginated({ page, limit: 50 })
  , [page]);

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

  return (
    <section>
      <h2><b>Hospitales Cercanos</b></h2>
      <p className="hospital-subtitulo">Selecciona un hospital para obtener cómo llegar</p>

      <SearchBar
        value={busqueda}
        onChange={setBusqueda}
        placeholder="Buscar por nombre, ciudad o estado..."
      />

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
          <Loader />
        </div>
      )}
      {error   && <p className="error-txt">{error}</p>}

      {!loading && !error && (
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

      {!loading && !error && listaFiltrada.length > 0 && (
        <Paginacion paginaActual={page} totalPaginas={totalPaginas} cambiarPagina={setPage} />
      )}
    </section>
  );
}
