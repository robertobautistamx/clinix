// ══════════════════════════════════════════════════════
//  pages/Recomendaciones.tsx
// ══════════════════════════════════════════════════════

interface Recomendacion {
  base: string;
  recomendado: string;
  probabilidad: number;
  icono: string;
}

const RECOMENDACIONES_MOCK: Recomendacion[] = [
  { base: 'Paracetamol',  recomendado: 'Agua de coco + reposo',    probabilidad: 75, icono: '💊' },
  { base: 'Ibuprofeno',   recomendado: 'Gel antibacterial',        probabilidad: 60, icono: '🧴' },
  { base: 'Omeprazol',    recomendado: 'Dieta blanda + probiótico', probabilidad: 82, icono: '🥣' },
  { base: 'Amoxicilina',  recomendado: 'Probiótico + vitamina C',  probabilidad: 70, icono: '🍊' },
];

function colorProbabilidad(p: number): string {
  if (p >= 80) return '#27ae60';
  if (p >= 60) return '#e67e22';
  return '#e74c3c';
}

export default function Recomendaciones() {
  return (
    <section>
      <h2><b>Recomendaciones Inteligentes</b></h2>
      <p className="hospital-subtitulo">Sugerencias basadas en los medicamentos más usados</p>

      <div className="hospitales-grid">
        {RECOMENDACIONES_MOCK.map((rec, i) => (
          <div key={i} className="card-hosp">
            <div
              className="card-hosp-img"
              style={{
                background: 'linear-gradient(135deg,#1a2e40,#3a7bd5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5em',
              }}
            >
              {rec.icono}
            </div>
            <div className="card-hosp-info">
              <p className="card-hosp-tipo" style={{ marginBottom: 4 }}>Si usas</p>
              <h3>{rec.base}</h3>
              <p className="card-hosp-location">🤖 Te recomendamos: <b>{rec.recomendado}</b></p>
              <div style={{ marginTop: 10 }}>
                <p className="prob-label">Probabilidad de complemento</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="prob-barra-wrap" style={{ flex: 1 }}>
                    <div
                      className="prob-barra"
                      style={{ width: `${rec.probabilidad}%`, background: colorProbabilidad(rec.probabilidad) }}
                    />
                  </div>
                  <span className="prob-badge" style={{ background: colorProbabilidad(rec.probabilidad) }}>
                    {rec.probabilidad}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
