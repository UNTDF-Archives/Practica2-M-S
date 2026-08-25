import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Database } from 'lucide-react';

export default function VectorInspector({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  const { tVector, xVector, metrics } = data;

  return (
    <div className="glass-panel" style={{ overflow: 'hidden', transition: 'all 0.3s ease' }}>
      {/* Botón Barra Desplegable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          color: 'var(--text-main)',
          fontSize: '0.9rem',
          fontWeight: 600
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Database size={18} color="#06b6d4" />
          <span>Tabla de Vectores (Dominio e Imagen)</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.06)', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: 500 }}>
            N = {metrics.count} muestras
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {!isOpen && (
            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              <span>Mín: <strong style={{ color: '#ec4899' }}>{metrics.min}</strong></span>
              <span>Máx: <strong style={{ color: '#10b981' }}>{metrics.max}</strong></span>
            </div>
          )}
          {isOpen ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
        </div>
      </button>

      {/* Contenido Desplegable */}
      {isOpen && (
        <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', borderTop: '1px solid var(--border-color)' }}>
          {/* Tarjetas de Métricas */}
          <div className="metrics-row" style={{ margin: '1rem 0' }}>
            <div className="metric-card">
              <div className="metric-lbl">Muestras (N)</div>
              <div className="metric-val">{metrics.count}</div>
            </div>
            <div className="metric-card">
              <div className="metric-lbl">Mínimo</div>
              <div className="metric-val" style={{ color: '#ec4899' }}>{metrics.min}</div>
            </div>
            <div className="metric-card">
              <div className="metric-lbl">Máximo</div>
              <div className="metric-val" style={{ color: '#10b981' }}>{metrics.max}</div>
            </div>
            <div className="metric-card">
              <div className="metric-lbl">Media</div>
              <div className="metric-val" style={{ color: '#6366f1' }}>{metrics.mean}</div>
            </div>
            <div className="metric-card">
              <div className="metric-lbl">RMS</div>
              <div className="metric-val" style={{ color: '#38bdf8' }}>{metrics.rms}</div>
            </div>
          </div>

          {/* Tabla de Vectores T y X */}
          <div className="vector-table-container">
            <table className="vector-table">
              <thead>
                <tr>
                  <th>i</th>
                  <th>Dominio t[i] (s)</th>
                  <th>Imagen x(t[i])</th>
                </tr>
              </thead>
              <tbody>
                {tVector.map((t, idx) => (
                  <tr key={idx}>
                    <td style={{ color: 'var(--text-dim)' }}>#{idx}</td>
                    <td style={{ color: '#06b6d4' }}>{t} s</td>
                    <td style={{ color: xVector[idx] >= 0 ? '#10b981' : '#ec4899', fontWeight: 600 }}>
                      {xVector[idx]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
