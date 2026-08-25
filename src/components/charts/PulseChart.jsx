import React from 'react';
import { Line } from 'react-chartjs-2';
import { Activity } from 'lucide-react';

export default function PulseChart({ data, A, t0, D, isDiscrete }) {
  const { tVector, xVector } = data;

  const chartData = {
    labels: tVector.map(t => t.toFixed(2)),
    datasets: [
      {
        label: `Pulso Recortado p(t) [t0=${t0}, D=${D}]`,
        data: xVector,
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.25)',
        borderWidth: 3,
        stepped: !isDiscrete ? 'before' : false,
        pointRadius: isDiscrete ? 4 : 2,
        pointBackgroundColor: '#a855f7',
        fill: true,
        tension: 0
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
        grid: { color: 'rgba(255, 255, 255, 0.06)' },
        ticks: { color: '#9ca3af', font: { family: 'Fira Code', size: 10 } },
        suggestedMin: -0.2,
        suggestedMax: Math.max(A * 1.3, 1.2)
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem', padding: '0 0.25rem' }}>
        <div style={{ fontSize: '0.75rem', color: '#a855f7', background: 'rgba(168, 85, 247, 0.1)', padding: '0.15rem 0.5rem', borderRadius: '6px', fontFamily: 'var(--font-mono)' }}>
          <Activity size={12} style={{ display: 'inline', marginRight: '4px' }} />
          t ∈ [{t0}, {(t0 + D).toFixed(1)}]
        </div>
        <div style={{ fontSize: '0.75rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '0.15rem 0.5rem', borderRadius: '6px', fontFamily: 'var(--font-mono)' }}>
          D: {D} s
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
