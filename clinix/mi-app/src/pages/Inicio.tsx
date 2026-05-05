// ══════════════════════════════════════════════════════
//  pages/Inicio.tsx
// ══════════════════════════════════════════════════════

import { useState } from 'react';
import { User, Pill, Check, AlertTriangle, ChevronLeft } from 'lucide-react';

interface Zona {
  id: string;
  label: string;
}

const ZONAS: Zona[] = [
  { id: 'cabeza',   label: 'Cabeza' },
  { id: 'pecho',    label: 'Pecho' },
  { id: 'estomago', label: 'Estómago' },
  { id: 'general',  label: 'General' },
];

const SINTOMAS_POR_ZONA: Record<string, string[]> = {
  cabeza:   ['Dolor de cabeza', 'Mareos', 'Visión borrosa', 'Náuseas', 'Fiebre'],
  pecho:    ['Dolor en el pecho', 'Dificultad para respirar', 'Palpitaciones', 'Tos'],
  estomago: ['Dolor abdominal', 'Náuseas', 'Vómito', 'Diarrea', 'Acidez'],
  general:  ['Fiebre', 'Cansancio', 'Dolor muscular', 'Escalofríos', 'Pérdida de apetito'],
};

const NIVEL_LABELS: string[] = [
  '', 'Muy leve', 'Leve', 'Moderado-leve', 'Moderado', 'Moderado',
  'Significativo', 'Intenso', 'Muy intenso', 'Severo', 'Urgente',
];


const NIVEL_COLORS: string[] = [
  '', '#27ae60','#27ae60','#f1c40f','#f1c40f','#e67e22',
  '#e67e22','#e74c3c','#e74c3c','#c0392b','#c0392b',
];

interface ResultadoDx {
  dx: string;
  especialista: string;
  medicamento: string;
  intensidad: number;
  sintomas: string[];
}

const RECOMENDACIONES: Record<string, Omit<ResultadoDx, 'intensidad' | 'sintomas'>> = {
  cabeza:   { dx: 'Posible cefalea tensional', especialista: 'Neurólogo', medicamento: 'Paracetamol 500mg' },
  pecho:    { dx: 'Evaluación cardiológica recomendada', especialista: 'Cardiólogo', medicamento: 'Consultar urgencias si dolor agudo' },
  estomago: { dx: 'Posible gastritis / colitis', especialista: 'Gastroenterólogo', medicamento: 'Omeprazol 20mg' },
  general:  { dx: 'Posible síndrome viral', especialista: 'Médico General', medicamento: 'Paracetamol + reposo' },
};

export default function Inicio() {
  const [zona, setZona] = useState<string | null>(null);
  const [sintomasSeleccionados, setSintomasSeleccionados] = useState<string[]>([]);
  const [intensidad, setIntensidad] = useState(5);
  const [resultado, setResultado] = useState<ResultadoDx | null>(null);

  function seleccionarZona(z: string) {
    setZona(z);
    setSintomasSeleccionados([]);
    setResultado(null);
  }

  function toggleSintoma(s: string) {
    setSintomasSeleccionados((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  function diagnosticar() {
    if (!zona || sintomasSeleccionados.length === 0) return;
    setResultado({ ...RECOMENDACIONES[zona], intensidad, sintomas: sintomasSeleccionados });
  }

  function reiniciar() {
    setZona(null);
    setSintomasSeleccionados([]);
    setIntensidad(5);
    setResultado(null);
  }

  /* ── Resultado ── */
  if (resultado) {
    return (
      <div className="welcome">
        <h1><b>Resultado del Diagnóstico</b></h1>

        {resultado.intensidad >= 8 && (
          <div className="alerta-box">
            <p><AlertTriangle size={16} style={{ marginRight: 8 }} /> Intensidad alta detectada. Si sientes dolor severo, busca atención de urgencias.</p>
          </div>
        )}

        <div className="card card-result" style={{ marginTop: 18 }}>
          <div className="card-result-top">
            <b>{resultado.dx}</b>
            <span className="prob-badge" style={{ background: NIVEL_COLORS[resultado.intensidad] }}>
              Intensidad {resultado.intensidad}/10
            </span>
          </div>
          <p className="prob-label">Síntomas: {resultado.sintomas.join(', ')}</p>
          <div className="prob-barra-wrap">
            <div className="prob-barra" style={{ width: `${resultado.intensidad * 10}%`, background: NIVEL_COLORS[resultado.intensidad] }} />
          </div>
        </div>

        <div className="card card-doctor" style={{ marginTop: 14 }}>
          <span className="doc-icon"><User size={36} /></span>
          <div>
            <p className="doc-label">Especialista recomendado</p>
            <p className="doc-nombre">{resultado.especialista}</p>
          </div>
        </div>

        <div className="card" style={{ marginTop: 14 }}>
          <p><b><Pill size={14} style={{ marginRight: 8 }} /> Medicamento sugerido:</b> {resultado.medicamento}</p>
          <p style={{ fontSize: '0.82em', color: '#7a94a8', marginTop: 8 }}>
            Consulta siempre a un médico antes de automedicarte.
          </p>
        </div>

        <button className="btn-primary" style={{ marginTop: 20 }} onClick={reiniciar}>
          <ChevronLeft size={14} style={{ marginRight: 8 }} />Volver al inicio
        </button>
      </div>
    );
  }

  /* ── Síntomas ── */
  if (zona) {
    const sintomas = SINTOMAS_POR_ZONA[zona] ?? [];
    const pct = ((intensidad - 1) / 9) * 100;

    return (
      <div className="welcome">
        <h1><b>¿Qué síntomas tienes?</b></h1>
        <p style={{ color: 'rgba(44,62,80,0.7)' }}>Zona: <b>{zona}</b></p>

        <div className="opciones" style={{ flexWrap: 'wrap' }}>
            {sintomas.map((s) => (
            <button
              key={s}
              className={`opcion-btn${sintomasSeleccionados.includes(s) ? ' opcion-btn--selected' : ''}`}
              onClick={() => toggleSintoma(s)}
            >
              {sintomasSeleccionados.includes(s) ? <Check size={12} style={{ marginRight: 8 }} /> : null}{s}
            </button>
          ))}
        </div>

        <div id="contenedorIntensidad" style={{ marginTop: 24 }}>
          <b>Intensidad del dolor</b>
          <div className="slider-wrapper">
            <div
              id="sliderBubble"
              style={{
                left: `calc(${pct}% - 20px)`,
                background: `linear-gradient(135deg, ${NIVEL_COLORS[intensidad]}, ${NIVEL_COLORS[intensidad]}cc)`,
              }}
            >
              {intensidad} — {NIVEL_LABELS[intensidad]}
            </div>
            <input
              type="range"
              id="intensidad"
              min={1} max={10}
              value={intensidad}
              onChange={(e) => setIntensidad(Number(e.target.value))}
            />
          </div>
          <div className="slider-labels">
            <span>1 — Muy leve</span>
            <span>10 — Urgente</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button className="btn-secondary" onClick={reiniciar}><ChevronLeft size={14} style={{ marginRight: 8 }} />Volver</button>
          <button
            className="btn-primary"
            disabled={sintomasSeleccionados.length === 0}
            onClick={diagnosticar}
          >
            Ver diagnóstico →
          </button>
        </div>
      </div>
    );
  }

  /* ── Selector de zona ── */
  return (
    <div className="welcome">
      <h1><b>¿Cómo te sientes hoy?</b></h1>
      <p>Selecciona dónde te duele</p>
      <div className="opciones">
        {ZONAS.map((z) => (
          <button key={z.id} className="opcion-btn" onClick={() => seleccionarZona(z.id)}>
            {z.label}
          </button>
        ))}
      </div>
    </div>
  );
}
