import React, { useMemo, useState, useEffect } from 'react';
import './DataTable.css';
import { Edit, Trash2, ShoppingCart, Filter } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
}

interface Props {
  columns: Column[];
  data: any[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onAdd?: (row: any) => void;
  searchPlaceholder?: string;
  showSearch?: boolean; // si false, se oculta la búsqueda interna (usar búsqueda externa)
  compact?: boolean; // diseño compacto
  showHeaderAdd?: boolean; // si true, muestra botón Agregar en el header (por defecto false)
}

export default function DataTable({ columns, data, onEdit, onDelete, onAdd, searchPlaceholder, showSearch = true, compact = false, showHeaderAdd = false }: Props) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [debouncedFilters, setDebouncedFilters] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);

  // Debounce búsqueda y filtros para mejorar UX y performance
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 280);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedFilters(filters), 280);
    return () => clearTimeout(t);
  }, [filters]);

  // Filtrado y ordenamiento (incluye columnas con render)
  const filtered = useMemo(() => {
    const s = debouncedSearch.trim().toLowerCase();

    const filteredRows = data.filter((row) => {
      if (s && !JSON.stringify(row).toLowerCase().includes(s)) return false;

      for (const col of columns) {
        const key = col.key;
        const term = (debouncedFilters[key] || '').trim().toLowerCase();
        if (!term) continue;

        let cellVal = '';
        try {
          if (col.render) {
            const rendered = col.render((row as any)[key], row);
            if (typeof rendered === 'string' || typeof rendered === 'number') cellVal = String(rendered);
            else if (rendered === null || rendered === undefined) cellVal = '';
            else if ((rendered as any)?.props?.children) {
              const children = (rendered as any).props.children;
              cellVal = typeof children === 'string' || typeof children === 'number' ? String(children) : JSON.stringify(children);
            } else {
              cellVal = JSON.stringify(rendered);
            }
          } else {
            const v = (row as any)[key];
            cellVal = v == null ? '' : String(v);
          }
        } catch (e) {
          cellVal = '';
        }

        if (!cellVal.toLowerCase().includes(term)) return false;
      }

      return true;
    });

    if (!sortKey) return filteredRows;

    const colForSort = columns.find((c) => c.key === sortKey);
    return [...filteredRows].sort((a, b) => {
      let av: any;
      let bv: any;
      if (colForSort?.render) {
        const ra = colForSort.render((a as any)[sortKey], a);
        const rb = colForSort.render((b as any)[sortKey], b);
        av = typeof ra === 'string' || typeof ra === 'number' ? ra : JSON.stringify(ra);
        bv = typeof rb === 'string' || typeof rb === 'number' ? rb : JSON.stringify(rb);
      } else {
        av = (a as any)[sortKey];
        bv = (b as any)[sortKey];
      }

      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      const sa = String(av).toLowerCase();
      const sb = String(bv).toLowerCase();
      if (sa < sb) return sortDir === 'asc' ? -1 : 1;
      if (sa > sb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, debouncedSearch, sortKey, sortDir, debouncedFilters, columns]);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  // Limpia filtros que no correspondan a columnas (cuando cambian columnas)
  useEffect(() => {
    setFilters((prev) => {
      const next: Record<string, string> = {};
      for (const c of columns) {
        if (prev[c.key]) next[c.key] = prev[c.key];
      }
      return next;
    });
  }, [columns]);

  const hasFilters = search.trim() !== '' || Object.values(filters).some(v => v && v.trim() !== '');

  const clearAll = () => { setSearch(''); setDebouncedSearch(''); setFilters({}); setDebouncedFilters({}); setSortKey(null); setSortDir('asc'); };

  return (
    <div className={`datatable ${compact ? 'datatable--compact' : ''} ${showFilters ? 'datatable--filters-open' : ''}`}>
      {(showSearch || showHeaderAdd) && (
        <div className="datatable-toolbar">
          {showSearch ? (
            <input
              className="datatable-search"
              placeholder={searchPlaceholder || 'Buscar...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          ) : (
            <div style={{ flex: 1 }} />
          )}
          <div className="datatable-actions">
            {hasFilters && (
              <button className="datatable-btn ghost" onClick={clearAll} title="Limpiar filtros">
                Limpiar
              </button>
            )}
            <button
              className={`datatable-btn ghost datatable-filter-btn${showFilters ? ' active' : ''}`}
              onClick={() => setShowFilters((s) => !s)}
              aria-pressed={showFilters}
              title={showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
            >
              <Filter size={14} />
              {(() => {
                const activeCount = (search.trim() ? 1 : 0) + Object.values(filters).filter(v => v && v.trim() !== '').length;
                return activeCount > 0 ? <span className="datatable-filter-badge">{activeCount}</span> : null;
              })()}
            </button>
            {showHeaderAdd && onAdd && (
              <button className="datatable-btn primary" onClick={() => onAdd({})} title="Agregar">
                <ShoppingCart size={14} style={{ marginRight: 8 }} /> Agregar
              </button>
            )}
          </div>
        </div>
      )}

      <div className="datatable-table-wrap">
        <table className="datatable-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} style={{ width: col.width }} className={sortKey === col.key ? 'datatable-th sorted' : 'datatable-th'}>
                  <div onClick={() => toggleSort(col.key)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <span>{col.label}</span>
                    <span className="datatable-sort-indicator">{sortKey === col.key ? (sortDir === 'asc' ? '▲' : '▼') : '▴'}</span>
                  </div>
                  <input
                    type="text"
                    placeholder={`Filtrar ${col.label}...`}
                    value={filters[col.key] || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, [col.key]: e.target.value }))}
                    onClick={(e) => e.stopPropagation()}
                    className="datatable-col-filter"
                    style={{ marginTop: 6, width: '100%', padding: '6px 10px', fontSize: '0.92em', boxSizing: 'border-box' }}
                  />
                </th>
              ))}
              {(onEdit || onDelete || onAdd) && <th style={{ width: 140 }}>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, idx) => (
              <tr key={(row.product_id ?? row.doctor_id ?? row.patient_id ?? row.hospital_id ?? row.transaction_id ?? row.id ?? idx) as any}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render((row as any)[col.key], row) : String((row as any)[col.key] ?? '')}
                  </td>
                ))}
                {(onEdit || onDelete || onAdd) && (
                  <td className="datatable-actions-cell">
                    {onEdit && (
                      <button className="datatable-btn ghost" onClick={() => onEdit(row)} title="Editar">
                        <Edit size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button className="datatable-btn ghost danger" onClick={() => onDelete(row)} title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    )}
                    {onAdd && (
                      <button className="datatable-btn ghost" onClick={() => onAdd(row)} title="Agregar">
                        <ShoppingCart size={16} />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '18px 0' }}>
                  No hay registros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
