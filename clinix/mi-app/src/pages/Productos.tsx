// ══════════════════════════════════════════════════════
//  pages/Productos.tsx
// ══════════════════════════════════════════════════════

import { useFetch } from '../hooks/useFetch';
import { productosService, Producto } from '../services/api';
import { useCarrito } from '../context/CarritoContext';
import { useState } from 'react';
import Paginacion from '../components/Paginacion';

export default function Productos() {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useFetch(() =>
    productosService.getPaginated({ page, limit: 50 })
  , [page]);
  const { agregar, items } = useCarrito();

  const enCarrito = (id: number) => items.find((i) => i.product_id === id);
  const resData: any = data;
  let lista: Producto[] = Array.isArray(resData) ? resData : (resData?.data ?? resData?.items ?? []);
  let totalPaginas = resData?.totalPages ?? (resData?.total ? Math.ceil(resData.total / 50) : 1);

  // LOG para ver qué campos está mandando el backend realmente
  console.log('Productos recibidos:', lista);

  // Si el backend mandó todos los registros sin paginar, los recortamos en React
  if (Array.isArray(resData)) {
    totalPaginas = Math.ceil(lista.length / 50) || 1;
    lista = lista.slice((page - 1) * 50, page * 50);
  }

  return (
    <section>
      <h2><b>Productos / Medicamentos</b></h2>
      <p className="hospital-subtitulo">Agrega medicamentos a tu carrito</p>

      {loading && <p>Cargando productos...</p>}
      {error   && <p className="error-txt">⚠️ {error}</p>}

      {!loading && !error && (
        <div className="hospitales-grid">
          {lista.length === 0 && <p>No hay productos registrados.</p>}
          {lista.map((prod) => {
            const precioStr = (prod as any).unit_price ?? prod.price;
            const precioNum = precioStr != null ? Number(precioStr) : null;
            const stock = (prod as any).stock_units ?? prod.stock ?? 0;

            return (
              <div key={prod.product_id} className="card-hosp">
                <div
                  className="card-hosp-img"
                  style={{
                    background: 'linear-gradient(135deg,#3a7bd5,#5a9bf5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5em',
                  }}
                >
                  💊
                  {stock === 0 && (
                    <span className="card-hosp-badge" style={{ background: '#e74c3c', color: '#fff' }}>
                      Sin stock
                    </span>
                  )}
                </div>

                <div className="card-hosp-info">
                  <h3>{prod.name}</h3>
                  {prod.description && (
                    <p className="card-hosp-tipo" style={{ fontSize: '0.82em', color: '#7a94a8' }}>
                      {prod.description}
                    </p>
                  )}
                  <p className="card-hosp-location" style={{ fontWeight: 700, color: '#1a2e40' }}>
                    ${precioNum != null ? precioNum.toFixed(2) : '—'} MXN
                  </p>
                  {stock != null && (
                    <p style={{ fontSize: '0.78em', color: stock > 0 ? '#27ae60' : '#e74c3c' }}>
                      {stock > 0 ? `📦 Stock: ${stock}` : '⚠️ Sin stock'}
                    </p>
                  )}
                  <div className="card-hosp-footer" style={{ marginTop: 10 }}>
                    <button
                      className={`btn-carrito${enCarrito(prod.product_id) ? ' btn-carrito--added' : ''}`}
                      disabled={stock === 0}
                      onClick={() => agregar(prod)}
                    >
                      {enCarrito(prod.product_id) ? '✅ Agregado' : '🛒 Agregar'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && lista.length > 0 && (
        <Paginacion paginaActual={page} totalPaginas={totalPaginas} cambiarPagina={setPage} />
      )}
    </section>
  );
}
