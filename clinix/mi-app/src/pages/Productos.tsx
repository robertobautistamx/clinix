// ══════════════════════════════════════════════════════
//  pages/Productos.tsx
// ══════════════════════════════════════════════════════

import { useFetch } from '../hooks/useFetch';
import { productosService, Producto } from '../services/api';
import { useCarrito } from '../context/CarritoContext';
import { useState } from 'react';
import { Pill, Check, ShoppingCart, AlertTriangle, Plus, Save, Package } from 'lucide-react';
import Paginacion from '../components/Paginacion';
import Loader from '../components/Loader';
import SearchBar from '../components/SearchBar';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ValidationMessages from '../components/ValidationMessages';
import { validateFields } from '../hooks/useValidator';
import { useViewMode } from '../hooks/useViewMode';

interface FormProducto {
  name: string;
  price: string;
  stock: string;
}

const FORM_INICIAL: FormProducto = { name: '', price: '', stock: '' };

export default function Productos() {
  const [page, setPage] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const { data, loading, error, refetch } = useFetch(() =>
    productosService.getPaginated({ page, limit: 50 })
  , [page]);
  const [view, setView] = useViewMode('productos');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState<FormProducto>(FORM_INICIAL);
  const [guardando, setGuardando] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const { agregar, items, abrirCarrito } = useCarrito();

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

  const listaFiltrada = lista.filter((prod) => {
    if (!busqueda) return true;
    const texto = `${prod.name} ${(prod as any).category ?? ''}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  function abrirModal() { setEditingId(null); setForm(FORM_INICIAL); setFormError(''); setFieldErrors({}); setModalAbierto(true); }
  function cerrarModal() { setModalAbierto(false); }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function guardar() {
    const rules = {
      name: { required: true, message: 'El nombre es requerido' },
      price: { required: true, message: 'El precio es requerido' },
      stock: { required: true, message: 'El stock es requerido' },
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
        price: Number(form.price),
        stock: Number(form.stock),
        unit_price: Number(form.price),
        stock_units: Number(form.stock),
      } as any;
      if (editingId) {
        await productosService.update(editingId, payload);
        alert('Producto actualizado');
      } else {
        await productosService.create(payload);
        alert('Producto creado');
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

  const handleEdit = (prod: Producto) => {
    setEditingId(prod.product_id || (prod as any).id);
    setForm({
      name: prod.name ?? '',
      price: prod.price != null ? String(prod.price) : ((prod as any).unit_price != null ? String((prod as any).unit_price) : ''),
      stock: prod.stock != null ? String(prod.stock) : ((prod as any).stock_units != null ? String((prod as any).stock_units) : ''),
    });
    setFormError('');
    setFieldErrors({});
    setModalAbierto(true);
  };

  const handleDelete = async (prod: Producto) => {
    if (!window.confirm(`¿Eliminar "${prod.name}"?`)) return;
    try {
      await productosService.delete(prod.product_id || (prod as any).id);
      alert('Producto eliminado');
      refetch();
    } catch (err: any) {
      alert('Error eliminando: ' + (err.message || err) + '\n\n(Es posible que el producto esté asociado a una transacción y no pueda eliminarse)');
    }
  };

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2><b>Productos / Medicamentos</b></h2>
          <p className="hospital-subtitulo">Agrega medicamentos a tu carrito</p>
        </div>
        <button className="btn-primary" onClick={abrirModal}><Plus size={14} style={{ marginRight: 8 }} />Agregar Producto</button>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, marginRight: 12 }}>
          <SearchBar value={busqueda} onChange={setBusqueda} placeholder="Buscar por nombre o categoria..." />
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
            (() => {
              const cols: any[] = [ { key: 'name', label: 'Nombre' } ];
              cols.push({ key: 'price', label: 'Precio', render: (_v: any, row: any) => {
                const precioStr = (row as any).unit_price ?? row.price;
                const precioNum = precioStr != null ? Number(precioStr) : null;
                return `\$${precioNum != null ? precioNum.toFixed(2) : '—'} MXN`;
              }});
              cols.push({ key: 'stock', label: 'Stock', render: (_v: any, row: any) => (row.stock ?? (row as any).stock_units ?? 0) });

              return (
                <DataTable
                  columns={cols}
                  data={listaFiltrada}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAdd={(prod) => { agregar(prod); abrirCarrito(); }}
                  searchPlaceholder="Buscar por nombre o categoria..."
                  showSearch={false}
                />
              );
            })()
          ) : (
            <div className="hospitales-grid">
              {listaFiltrada.length === 0 && <p>No hay productos que coincidan con la búsqueda.</p>}
              {listaFiltrada.map((prod) => {
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
                      <Pill size={48} />
                      {stock === 0 && (
                        <span className="card-hosp-badge" style={{ background: '#e74c3c', color: '#fff' }}>
                          Sin stock
                        </span>
                      )}
                    </div>

                    <div className="card-hosp-info">
                      <h3>{prod.name}</h3>
                      {/* descripción eliminada por requerimiento */}
                      <p className="card-hosp-location" style={{ fontWeight: 700, color: '#1a2e40' }}>
                        ${precioNum != null ? precioNum.toFixed(2) : '—'} MXN
                      </p>
                      {stock != null && (
                        <p style={{ fontSize: '0.78em', color: stock > 0 ? '#27ae60' : '#e74c3c' }}>
                          {stock > 0 ? `Stock: ${stock}` : 'Sin stock'}
                        </p>
                      )}
                      <div className="card-hosp-footer" style={{ marginTop: 10 }}>
                        <button
                          className={`btn-carrito${enCarrito(prod.product_id) ? ' btn-carrito--added' : ''}`}
                          disabled={stock === 0}
                          onClick={() => { agregar(prod); abrirCarrito(); }}
                        >
                          {enCarrito(prod.product_id) ? <><Check size={14} style={{ marginRight: 8 }} />Agregado</> : <><ShoppingCart size={14} style={{ marginRight: 8 }} />Agregar</>}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
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
        title={editingId ? "Editar Producto" : "Registrar Producto"}
        subtitle="Completa los datos del producto"
        icon={<Package size={20} />}
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
          <div className="modal-campo">
            <label>Nombre del Producto <span className="req">*</span></label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Ej. Paracetamol 500mg" />
            <ValidationMessages field="name" errors={fieldErrors} />
          </div>
        </div>
        {/* descripción eliminada */}
        <div className="modal-fila">
          <div className="modal-campo">
            <label>Precio (MXN) <span className="req">*</span></label>
            <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} placeholder="Ej. 150.00" />
            <ValidationMessages field="price" errors={fieldErrors} />
          </div>
          <div className="modal-campo">
            <label>Stock Inicial <span className="req">*</span></label>
            <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Ej. 100" />
            <ValidationMessages field="stock" errors={fieldErrors} />
          </div>
        </div>
      </Modal>
    </section>
  );
}
