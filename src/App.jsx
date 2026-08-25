import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import SignalSelector from './components/SignalSelector';
import ControlPanel from './components/ControlPanel';
import FormulaCard from './components/FormulaCard';
import VectorInspector from './components/VectorInspector';
import DashboardGrid from './components/DashboardGrid';

import StepChart from './components/charts/StepChart';
import SinePhasorChart from './components/charts/SinePhasorChart';
import ExponentialChart from './components/charts/ExponentialChart';
import DampedSineChart from './components/charts/DampedSineChart';
import PulseChart from './components/charts/PulseChart';

import { generateSignalData } from './utils/signalGenerators';

const DEFAULT_PARAMS = {
  A: 2.0,
  f0: 1.0,
  thetaDeg: 0,
  t0: 1.0,
  alpha: -0.5,
  D: 3.0,
  tMin: -2,
  tMax: 8,
  numPoints: 200
};

export default function App() {
  const [viewMode, setViewMode] = useState('single'); // 'single' | 'grid'
  const [activeSignal, setActiveSignal] = useState('sine');
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [isDiscrete, setIsDiscrete] = useState(false);

  // Calcular vectores de dominio e imagen
  const signalData = useMemo(() => {
    return generateSignalData({ ...params, functionType: activeSignal });
  }, [params, activeSignal]);

  const handleResetParams = () => {
    setParams(DEFAULT_PARAMS);
  };

  // Renderizador dinámico del gráfico según la función activa
  const renderActiveChart = () => {
    switch (activeSignal) {
      case 'step':
        return <StepChart data={signalData} A={params.A} t0={params.t0} isDiscrete={isDiscrete} />;
      case 'sine':
        return <SinePhasorChart data={signalData} A={params.A} f0={params.f0} thetaDeg={params.thetaDeg} isDiscrete={isDiscrete} />;
      case 'exponential':
        return <ExponentialChart data={signalData} A={params.A} alpha={params.alpha} t0={params.t0} isDiscrete={isDiscrete} />;
      case 'damped':
        return <DampedSineChart data={signalData} A={params.A} f0={params.f0} thetaDeg={params.thetaDeg} alpha={params.alpha} isDiscrete={isDiscrete} />;
      case 'pulse':
        return <PulseChart data={signalData} A={params.A} t0={params.t0} D={params.D} isDiscrete={isDiscrete} />;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <Header viewMode={viewMode} setViewMode={setViewMode} />

      {viewMode === 'single' ? (
        <>
          <SignalSelector activeSignal={activeSignal} onSelect={setActiveSignal} />

          <div className="workspace-grid">
            {/* Barra lateral de controles y fórmulas */}
            <div className="controls-sidebar">
              <FormulaCard functionType={activeSignal} params={params} />
              <ControlPanel
                functionType={activeSignal}
                params={params}
                setParams={setParams}
                isDiscrete={isDiscrete}
                setIsDiscrete={setIsDiscrete}
                onReset={handleResetParams}
              />
            </div>

            {/* Panel Principal: Gráfico Especializado + Inspector de Dominio/Imagen */}
            <div className="chart-display-panel">
              <div className="glass-panel" style={{ padding: '1rem', minHeight: '440px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: '700', fontSize: '1.1rem', letterSpacing: '-0.01em' }}>
                    Gráfico
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    t ∈ [{params.tMin}, {params.tMax}] s | Δt: {signalData.dt} s
                  </div>
                </div>
                <div className="chart-canvas-wrapper">
                  {renderActiveChart()}
                </div>
              </div>

              <VectorInspector data={signalData} functionType={activeSignal} />
            </div>
          </div>
        </>
      ) : (
        <DashboardGrid
          params={params}
          isDiscrete={isDiscrete}
          onSelectFunction={(fn) => {
            setActiveSignal(fn);
            setViewMode('single');
          }}
        />
      )}
    </div>
  );
}
