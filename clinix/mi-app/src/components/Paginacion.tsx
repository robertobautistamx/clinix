// ══════════════════════════════════════════════════════
//  components/Paginacion.tsx
// ══════════════════════════════════════════════════════

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginacionProps {
  paginaActual: number;
  totalPaginas: number;
  cambiarPagina: (p: number) => void;
}

export default function Paginacion({ paginaActual, totalPaginas, cambiarPagina }: PaginacionProps) {
  // Si solo hay 1 página, no mostramos los botones
  if (totalPaginas <= 1) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 30, marginBottom: 10 }}>
      <button className="btn-secondary" disabled={paginaActual <= 1} onClick={() => cambiarPagina(paginaActual - 1)}>
        <ChevronLeft size={14} style={{ marginRight: 8 }} />Anterior
      </button>
      <span style={{ fontWeight: 600, color: '#1a2e40' }}>
        Página {paginaActual} de {totalPaginas}
      </span>
      <button className="btn-secondary" disabled={paginaActual >= totalPaginas} onClick={() => cambiarPagina(paginaActual + 1)}>
        Siguiente<ChevronRight size={14} style={{ marginLeft: 8 }} />
      </button>
    </div>
  );
}