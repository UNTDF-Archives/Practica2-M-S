import React from 'react';
import StepChart from './charts/StepChart';
import SinePhasorChart from './charts/SinePhasorChart';
import ExponentialChart from './charts/ExponentialChart';
import DampedSineChart from './charts/DampedSineChart';
import PulseChart from './charts/PulseChart';
import { generateSignalData } from '../utils/signalGenerators';

export default function DashboardGrid({ params, isDiscrete, onSelectFunction }) {
  // Generar datos para las 5 funciones
  const stepData = generateSignalData({ ...params, functionType: 'step' });
  const sineData = generateSignalData({ ...params, functionType: 'sine' });
  const expData = generateSignalData({ ...params, functionType: 'exponential' });
  const dampedData = generateSignalData({ ...params, functionType: 'damped' });
  const pulseData = generateSignalData({ ...params, functionType: 'pulse' });

  return (
    <div className="dashboard-grid">
      {/* 1. Escalón */}
      <div className="glass-panel dashboard-card" onClick={() => onSelectFunction('step')} style={{ cursor: 'pointer' }}>
        <div className="dashboard-card-title">
          <span style={{ color: '#06b6d4' }}>1. Escalón Unitario</span>
        </div>
        <div className="dashboard-chart-box">
          <StepChart data={stepData} A={params.A} t0={params.t0} isDiscrete={isDiscrete} />
        </div>
      </div>

      {/* 2. Seno */}
      <div className="glass-panel dashboard-card" onClick={() => onSelectFunction('sine')} style={{ cursor: 'pointer' }}>
        <div className="dashboard-card-title">
          <span style={{ color: '#ec4899' }}>2. Senoidal</span>
        </div>
        <div className="dashboard-chart-box">
          <SinePhasorChart data={sineData} A={params.A} f0={params.f0} thetaDeg={params.thetaDeg} isDiscrete={isDiscrete} />
        </div>
      </div>

      {/* 3. Exponencial */}
      <div className="glass-panel dashboard-card" onClick={() => onSelectFunction('exponential')} style={{ cursor: 'pointer' }}>
        <div className="dashboard-card-title">
          <span style={{ color: '#10b981' }}>3. Exponencial</span>
        </div>
        <div className="dashboard-chart-box">
          <ExponentialChart data={expData} A={params.A} alpha={params.alpha} t0={params.t0} isDiscrete={isDiscrete} />
        </div>
      </div>

      {/* 4. Señal Amortiguada */}
      <div className="glass-panel dashboard-card" onClick={() => onSelectFunction('damped')} style={{ cursor: 'pointer' }}>
        <div className="dashboard-card-title">
          <span style={{ color: '#6366f1' }}>4. Señal Amortiguada</span>
        </div>
        <div className="dashboard-chart-box">
          <DampedSineChart data={dampedData} A={params.A} f0={params.f0} thetaDeg={params.thetaDeg} alpha={params.alpha} isDiscrete={isDiscrete} />
        </div>
      </div>

      {/* 5. Pulso */}
      <div className="glass-panel dashboard-card" onClick={() => onSelectFunction('pulse')} style={{ cursor: 'pointer' }}>
        <div className="dashboard-card-title">
          <span style={{ color: '#a855f7' }}>5. Pulso Recortado</span>
        </div>
        <div className="dashboard-chart-box">
          <PulseChart data={pulseData} A={params.A} t0={params.t0} D={params.D} isDiscrete={isDiscrete} />
        </div>
      </div>
    </div>
  );
}
