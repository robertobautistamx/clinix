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
import DataTable from '../components/DataTable';
import { useViewMode } from '../hooks/useViewMode';

export default function Transacciones() {
  const [page, setPage] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const [view, setView] = useViewMode('transacciones');
  const { data, loading, error, refetch } = useFetch(() =>
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

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, marginRight: 12 }}>
          <SearchBar value={busqueda} onChange={setBusqueda} placeholder="Buscar por transaccion o paciente..." />
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

      {!loading && !error && listaFiltrada.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>{React.createElement(FileText, { size: 48 })}</div>
          <p>No hay transacciones registradas aún.</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {view === 'table' ? (
            <DataTable
              columns={[
                { key: 'transaction_id', label: 'ID' },
                { key: 'created_at', label: 'Fecha', render: (_v,row) => row.created_at ? new Date(row.created_at).toLocaleString('es-MX') : '—' },
                { key: 'patient_id', label: 'Paciente' },
                { key: 'total', label: 'Total', render: (_v,row) => `\$${Number((row as any).total_amount ?? row.total ?? 0).toFixed(2)} MXN` },
              ]}
              data={listaFiltrada}
              onDelete={async (row: Transaccion) => {
                const txId = row.transaction_id || (row as any).id;
                if (!window.confirm(`¿Eliminar la transacción #${txId}?`)) return;
                try {
                  await transaccionesService.delete(txId);
                  refetch();
                } catch (err: any) {
                  alert('Error al eliminar: ' + (err.message || err));
                }
              }}
              showSearch={false}
            />
          ) : (
            listaFiltrada.map((tx) => (
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
            ))
          )}
        </>
      )}

      {!loading && !error && listaFiltrada.length > 0 && (
        <Paginacion paginaActual={page} totalPaginas={totalPaginas} cambiarPagina={setPage} />
      )}
    </section>
  );
}
