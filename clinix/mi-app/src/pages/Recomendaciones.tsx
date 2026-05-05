// ══════════════════════════════════════════════════════
//  pages/Recomendaciones.tsx - Algoritmo Apriori real
// ══════════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { recomendacionesService, RecomendacionApriori } from '../services/api';
import { Bot, Package } from 'lucide-react';

function colorProbabilidad(p: number): string {
  if (p >= 80) return '#27ae60';
  if (p >= 60) return '#e67e22';
  return '#e74c3c';
}

export default function Recomendaciones() {
  const [recomendaciones, setRecomendaciones] = useState<RecomendacionApriori[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const cargar = async () => {
      try {
        setLoading(true);
        setError(null);
        const res: any = await recomendacionesService.getAll();
        
        // LOG para ver qué responde exactamente el backend
        console.log('Respuesta de recomendaciones desde el API:', res);

        if (!cancelled) {
          const lista = Array.isArray(res) ? res : (res.data ?? res.items ?? res.recomendaciones ?? []);
          setRecomendaciones(lista);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || 'No se pudieron cargar las recomendaciones');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    cargar();
    return () => { cancelled = true; };
  }, []);

  return (
    <section>
      <h2><b>Recomendaciones Inteligentes</b></h2>
      <p className="hospital-subtitulo">
        Sugerencias basadas en el algoritmo Apriori — productos comprados juntos por nuestros pacientes
      </p>

      {loading && (
        <div style={{ textAlign: 'center', padding: '2em' }}>
          <p>Cargando recomendaciones...</p>
        </div>
      )}

      {error && (
        <div style={{ background: '#fee', color: '#c33', padding: '1em', borderRadius: 8, margin: '1em 0' }}>
          <strong>Error:</strong> {error}
          <p style={{ fontSize: '0.9em', marginTop: 8 }}>
            Asegúrate de que el backend está corriendo en http://localhost:3000
          </p>
        </div>
      )}

      {!loading && !error && recomendaciones.length === 0 && (
        <div style={{ background: '#fffbe6', padding: '1em', borderRadius: 8, margin: '1em 0' }}>
          <p>No hay suficientes datos para generar recomendaciones.</p>
          <p style={{ fontSize: '0.9em' }}>
            Necesitas transacciones con múltiples productos compartiendo el mismo <code>transaction_code</code>.
          </p>
        </div>
      )}

      {!loading && !error && recomendaciones.length > 0 && (
        <div className="hospitales-grid">
          {recomendaciones.map((rec, i) => (
            <div key={`${rec.base_id}-${rec.recomendado_id}-${i}`} className="card-hosp">
              <div
                className="card-hosp-img"
                style={{
                  background: 'linear-gradient(135deg,#1a2e40,#3a7bd5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5em',
                }}
              >
                <Package size={48} color="white" />
              </div>
              <div className="card-hosp-info">
                <p className="card-hosp-tipo" style={{ marginBottom: 4 }}>Si compras</p>
                <h3>{rec.producto_base}</h3>
                <p className="card-hosp-location">
                  <Bot size={18} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Te recomendamos: <b>{rec.producto_recomendado}</b>
                </p>
                <p style={{ fontSize: '0.85em', color: '#666', marginTop: 4 }}>
                  Comprado junto {rec.veces_juntos} {rec.veces_juntos === 1 ? 'vez' : 'veces'}
                </p>
                <div style={{ marginTop: 10 }}>
                  <p className="prob-label">Probabilidad de complemento</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="prob-barra-wrap" style={{ flex: 1 }}>
                      <div
                        className="prob-barra"
                        style={{
                          width: `${Math.min(rec.probabilidad, 100)}%`,
                          background: colorProbabilidad(rec.probabilidad),
                        }}
                      />
                    </div>
                    <span
                      className="prob-badge"
                      style={{ background: colorProbabilidad(rec.probabilidad) }}
                    >
                      {rec.probabilidad}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
