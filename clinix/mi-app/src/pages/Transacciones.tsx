// ══════════════════════════════════════════════════════
//  pages/Transacciones.tsx
// ══════════════════════════════════════════════════════

import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { transaccionesService, Transaccion } from '../services/api';
import Paginacion from '../components/Paginacion';
import { FileText } from 'lucide-react';
import Loader from '../components/Loader';
import SearchBar from '../components/SearchBar';

export default function Transacciones() {
  const [page, setPage] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const { data, loading, error } = useFetch(() =>
    transaccionesService.getPaginated({ page, limit: 50 })
  , [page]);
  const resData: any = data;
  let lista: Transaccion[] = Array.isArray(resData) ? resData : (resData?.data ?? resData?.items ?? []);
  let totalPaginas = resData?.totalPages ?? (resData?.total ? Math.ceil(resData.total / 50) : 1);

  if (Array.isArray(resData)) {
    totalPaginas = Math.ceil(lista.length / 50) || 1;
    lista = lista.slice((page - 1) * 50, page * 50);
  }

  const listaFiltrada = lista.filter((tx) => {
    if (!busqueda) return true;
    const texto = `${tx.transaction_id} ${tx.patient_id ?? ''} ${tx.created_at ?? ''}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  return (
    <section>
      <h2><b>Transacciones</b></h2>
      <p className="hospital-subtitulo">Historial de compras realizadas</p>

      <SearchBar
        value={busqueda}
        onChange={setBusqueda}
        placeholder="Buscar por transaccion o paciente..."
      />

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
          <Loader />
        </div>
      )}
      {error   && <p className="error-txt">{error}</p>}

      {!loading && !error && listaFiltrada.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>{React.createElement(FileText, { size: 48 })}</div>
          <p>No hay transacciones registradas aún.</p>
        </div>
      )}

      {listaFiltrada.map((tx) => (
        <div key={tx.transaction_id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <p style={{ margin: 0, fontWeight: 700 }}>Transacción #{tx.transaction_id}</p>
            <p style={{ margin: 0, fontSize: '0.82em', color: '#7a94a8' }}>
              {tx.created_at ? new Date(tx.created_at).toLocaleString('es-MX') : '—'}
              {tx.patient_id ? ` · Paciente #${tx.patient_id}` : ''}
            </p>
          </div>
          <b style={{ fontSize: '1.2em', color: '#1a2e40' }}>${Number((tx as any).total_amount ?? (tx as any).total ?? 0).toFixed(2)} MXN</b>
        </div>
      ))}

      {!loading && !error && listaFiltrada.length > 0 && (
        <Paginacion paginaActual={page} totalPaginas={totalPaginas} cambiarPagina={setPage} />
      )}
    </section>
  );
}
