import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Zap, Eye } from 'lucide-react';

export default function ExponentialChart({ data, A, alpha, t0, isDiscrete }) {
  const { tVector, xVector } = data;
  const [scaleType, setScaleType] = useState('linear');

  const tau = alpha !== 0 ? (1 / Math.abs(alpha)).toFixed(2) : '∞';

  const chartData = {
    labels: tVector.map(t => t.toFixed(2)),
    datasets: [
      {
        label: `Exponencial A·e^(${alpha}(t-${t0}))`,
        data: scaleType === 'logarithmic' ? xVector.map(v => Math.max(v, 1e-4)) : xVector,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        borderWidth: 3,
        pointRadius: isDiscrete ? 4 : 1,
        pointBackgroundColor: '#10b981',
        tension: 0.3,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#e5e7eb', font: { family: 'Inter', size: 12 } }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.06)' },
        ticks: {
          color: '#9ca3af',
          font: { family: 'Fira Code', size: 10 },
          maxTicksLimit: 7,
          maxRotation: 0,
          minRotation: 0
        }
      },
      y: {
        type: scaleType,
        grid: { color: 'rgba(255, 255, 255, 0.06)' },
        ticks: { color: '#9ca3af', font: { family: 'Fira Code', size: 10 } }
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Controles de Escala & Indicador Tau */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem', padding: '0 0.25rem' }}>
        <div style={{ fontSize: '0.75rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.15rem 0.5rem', borderRadius: '6px', fontFamily: 'var(--font-mono)' }}>
          <Zap size={12} style={{ display: 'inline', marginRight: '4px' }} />
          τ: {tau} s
        </div>

        <button
          onClick={() => setScaleType(scaleType === 'linear' ? 'logarithmic' : 'linear')}
          className="btn"
          style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}
        >
          <Eye size={12} />
          Escala: {scaleType === 'linear' ? 'Lineal' : 'Log'}
        </button>
      </div>

      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
