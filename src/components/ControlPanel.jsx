import React from 'react';
import { Sliders, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react';

export default function ControlPanel({ functionType, params, setParams, isDiscrete, setIsDiscrete, onReset }) {
  const handleChange = (key, value) => {
    setParams(prev => ({ ...prev, [key]: parseFloat(value) }));
  };

  return (
    <div className="glass-panel controls-sidebar" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <Sliders size={18} color="#6366f1" />
          <span>Parámetros</span>
        </div>
        <button onClick={onReset} className="btn" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} title="Restablecer">
          <RefreshCw size={12} />
        </button>
      </div>

      {/* Switch Discreto vs Continuo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 0.75rem', borderRadius: '10px', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>Muestreo:</span>
        <button
          onClick={() => setIsDiscrete(!isDiscrete)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', color: isDiscrete ? '#38bdf8' : 'var(--text-dim)', fontWeight: 600 }}
        >
          {isDiscrete ? <ToggleRight size={22} color="#38bdf8" /> : <ToggleLeft size={22} color="#9ca3af" />}
          <span>{isDiscrete ? 'Discreto' : 'Continuo'}</span>
        </button>
      </div>

      {/* Slider: Amplitud A */}
      <div className="control-group">
        <div className="control-label-row">
          <span className="control-name">Amplitud (A)</span>
          <span className="control-val">{params.A}</span>
        </div>
        <input
          type="range"
          min="0.1"
          max="10"
          step="0.1"
          value={params.A}
          onChange={(e) => handleChange('A', e.target.value)}
          className="custom-range"
        />
      </div>

      {/* Sliders específicos por función */}
      {(functionType === 'sine' || functionType === 'damped') && (
        <>
          <div className="control-group">
            <div className="control-label-row">
              <span className="control-name">Frecuencia (f₀)</span>
              <span className="control-val">{params.f0} Hz</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={params.f0}
              onChange={(e) => handleChange('f0', e.target.value)}
              className="custom-range"
            />
          </div>

          <div className="control-group">
            <div className="control-label-row">
              <span className="control-name">Fase (θ)</span>
              <span className="control-val">{params.thetaDeg}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              step="5"
              value={params.thetaDeg}
              onChange={(e) => handleChange('thetaDeg', e.target.value)}
              className="custom-range"
            />
          </div>
        </>
      )}

      {(functionType === 'step' || functionType === 'exponential' || functionType === 'pulse') && (
        <div className="control-group">
          <div className="control-label-row">
            <span className="control-name">Desplazamiento t₀</span>
            <span className="control-val">{params.t0} s</span>
          </div>
          <input
            type="range"
            min="-5"
            max="5"
            step="0.25"
            value={params.t0}
            onChange={(e) => handleChange('t0', e.target.value)}
            className="custom-range"
          />
        </div>
      )}

      {(functionType === 'exponential' || functionType === 'damped') && (
        <div className="control-group">
          <div className="control-label-row">
            <span className="control-name">Factor Amortiguador / Exponencial (α)</span>
            <span className="control-val">{params.alpha}</span>
          </div>
          <input
            type="range"
            min="-3"
            max="2"
            step="0.1"
            value={params.alpha}
            onChange={(e) => handleChange('alpha', e.target.value)}
            className="custom-range"
          />
        </div>
      )}

      {functionType === 'pulse' && (
        <div className="control-group">
          <div className="control-label-row">
            <span className="control-name">Duración del Pulso (D)</span>
            <span className="control-val">{params.D} s</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="8"
            step="0.2"
            value={params.D}
            onChange={(e) => handleChange('D', e.target.value)}
            className="custom-range"
          />
        </div>
      )}

      {/* Controles de Rango de Dominio [tMin, tMax] y Muestras N */}
      <hr style={{ borderColor: 'var(--border-color)', margin: '0.5rem 0' }} />
      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
        Dominio (Rango y Puntos)
      </div>

      <div className="control-group">
        <div className="control-label-row">
          <span className="control-name">Puntos del Dominio (N)</span>
          <span className="control-val">{params.numPoints}</span>
        </div>
        <input
          type="range"
          min="20"
          max="500"
          step="10"
          value={params.numPoints}
          onChange={(e) => handleChange('numPoints', e.target.value)}
          className="custom-range"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        <div className="control-group">
          <div className="control-label-row">
            <span className="control-name">t_min</span>
            <span className="control-val">{params.tMin}</span>
          </div>
          <input
            type="range"
            min="-10"
            max="0"
            step="0.5"
            value={params.tMin}
            onChange={(e) => handleChange('tMin', e.target.value)}
            className="custom-range"
          />
        </div>

        <div className="control-group">
          <div className="control-label-row">
            <span className="control-name">t_max</span>
            <span className="control-val">{params.tMax}</span>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            step="0.5"
            value={params.tMax}
            onChange={(e) => handleChange('tMax', e.target.value)}
            className="custom-range"
          />
        </div>
      </div>
    </div>
  );
}
