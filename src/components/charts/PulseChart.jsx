import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Activity } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function PulseChart({ data, A, t0, D, isDiscrete }) {
  const { tVector, xVector } = data;
  const [jumpStyle, setJumpStyle] = useState('dashed'); // 'dashed' | 'invisible' | 'solid'

  const tMin = tVector && tVector.length > 0 ? tVector[0] : -2;
  const tMax = tVector && tVector.length > 0 ? tVector[tVector.length - 1] : 8;
  const t1 = t0 + D;

  let datasets = [];

  const safeTVector = tVector || [];

  if (isDiscrete) {
    datasets = [
      {
        label: `Pulso Discreto p[n] [t₀=${t0}, D=${D}]`,
        data: safeTVector.map((t, idx) => ({ x: t, y: xVector[idx] })),
        borderColor: '#a855f7',
        backgroundColor: '#a855f7',
        borderWidth: 0,
        pointRadius: 4,
        pointBackgroundColor: '#a855f7',
        showLine: false
      }
    ];
  } else {
    // 1. Tramo t < t0 (y = 0)
    const low1 = safeTVector.filter(t => t <= t0).map(t => ({ x: t, y: 0 }));
    if (!low1.some(p => p.x === t0)) low1.push({ x: t0, y: 0 });

    // 2. Tramo pulso t0 <= t <= t1 (y = A)
    const pulsePoints = [{ x: t0, y: A }, ...safeTVector.filter(t => t > t0 && t < t1).map(t => ({ x: t, y: A })), { x: t1, y: A }];

    // 3. Tramo t > t1 (y = 0)
    const low2 = [{ x: t1, y: 0 }, ...safeTVector.filter(t => t > t1).map(t => ({ x: t, y: 0 }))];

    datasets.push(
      {
        label: `Tramo Inicial`,
        data: low1,
        borderColor: '#a855f7',
        backgroundColor: 'transparent',
        borderWidth: 3,
        pointRadius: 0,
        tension: 0,
        fill: false
      },
      {
        label: `Pulso Recortado p(t) [t₀=${t0}, D=${D}]`,
        data: pulsePoints,
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.25)',
        borderWidth: 3,
        pointRadius: 0,
        tension: 0,
        fill: 'origin'
      },
      {
        label: `Tramo Final`,
        data: low2,
        borderColor: '#a855f7',
        backgroundColor: 'transparent',
        borderWidth: 3,
        pointRadius: 0,
        tension: 0,
        fill: false
      }
    );
  }

  // 4. Líneas de salto vertical en t0 y t1 (si no es invisible)
  if (jumpStyle !== 'invisible') {
    datasets.push(
      {
        label: `Salto Inicial`,
        data: [
          { x: t0, y: 0 },
          { x: t0, y: A }
        ],
        borderColor: jumpStyle === 'dashed' ? 'rgba(168, 85, 247, 0.8)' : '#a855f7',
        borderWidth: jumpStyle === 'dashed' ? 2 : 3,
        borderDash: jumpStyle === 'dashed' ? [6, 6] : [],
        pointRadius: 0,
        tension: 0,
        fill: false
      },
      {
        label: `Salto Final`,
        data: [
          { x: t1, y: A },
          { x: t1, y: 0 }
        ],
        borderColor: jumpStyle === 'dashed' ? 'rgba(168, 85, 247, 0.8)' : '#a855f7',
        borderWidth: jumpStyle === 'dashed' ? 2 : 3,
        borderDash: jumpStyle === 'dashed' ? [6, 6] : [],
        pointRadius: 0,
        tension: 0,
        fill: false
      }
    );
  }

  // 5. Marcadores de descontinuidad
  datasets.push({
    label: `Puntos de Salto`,
    data: [
      { x: t0, y: 0 },
      { x: t0, y: A },
      { x: t1, y: A },
      { x: t1, y: 0 }
    ],
    borderColor: '#a855f7',
    pointBackgroundColor: ['#0f172a', '#a855f7', '#a855f7', '#0f172a'],
    pointBorderColor: '#a855f7',
    pointBorderWidth: 2,
    pointRadius: 5,
    pointHoverRadius: 7,
    showLine: false
  });

  const chartData = { datasets };

  const minY = Math.min(0, A);
  const maxY = Math.max(0, A);
  const yPadding = Math.max(Math.abs(A) * 0.25, 0.5);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#e5e7eb',
          font: { family: 'Inter', size: 12 },
          filter: (legendItem) => {
            if (!legendItem?.text) return false;
            return (
              legendItem.text.startsWith('Pulso Recortado') ||
              legendItem.text.startsWith('Pulso Discreto')
            );
          }
        }
      },
      tooltip: {
        callbacks: {
          title: (items) => items?.[0]?.parsed?.x !== undefined ? `Tiempo (t): ${Number(items[0].parsed.x).toFixed(2)} s` : '',
          label: (item) => item?.parsed?.y !== undefined ? `Imagen p(t): ${Number(item.parsed.y).toFixed(2)}` : ''
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        min: tMin,
        max: tMax,
        grid: { color: 'rgba(255, 255, 255, 0.06)' },
        ticks: {
          color: '#9ca3af',
          font: { family: 'Fira Code', size: 10 },
          callback: (val) => Number(val).toFixed(2)
        },
        title: { display: true, text: isDiscrete ? 'Muestras n (t)' : 'Tiempo t (s)', color: '#9ca3af', font: { size: 10 } }
      },
      y: {
        type: 'linear',
        grid: { color: 'rgba(255, 255, 255, 0.06)' },
        ticks: { color: '#9ca3af', font: { family: 'Fira Code', size: 10 } },
        title: { display: true, text: isDiscrete ? 'Amplitud p[n]' : 'Amplitud p(t)', color: '#9ca3af', font: { size: 10 } },
        suggestedMin: minY - yPadding,
        suggestedMax: maxY + yPadding
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', padding: '0 0.25rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#a855f7', background: 'rgba(168, 85, 247, 0.1)', padding: '0.15rem 0.5rem', borderRadius: '6px', fontFamily: 'var(--font-mono)' }}>
            <Activity size={12} style={{ display: 'inline', marginRight: '4px' }} />
            t ∈ [{t0}, {t1.toFixed(1)}]
          </div>
          <div style={{ fontSize: '0.75rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '0.15rem 0.5rem', borderRadius: '6px', fontFamily: 'var(--font-mono)' }}>
            D: {D} s
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', background: 'rgba(255, 255, 255, 0.04)', padding: '2px 4px', borderRadius: '8px', border: '1px solid var(--border-color, rgba(255,255,255,0.1))' }}>
          <span style={{ fontSize: '0.7rem', color: '#9ca3af', marginRight: '4px' }}>Salto:</span>
          <button
            onClick={() => setJumpStyle('dashed')}
            style={{
              fontSize: '0.7rem',
              padding: '0.15rem 0.45rem',
              borderRadius: '5px',
              cursor: 'pointer',
              background: jumpStyle === 'dashed' ? 'rgba(168, 85, 247, 0.25)' : 'transparent',
              color: jumpStyle === 'dashed' ? '#c084fc' : '#9ca3af',
              border: jumpStyle === 'dashed' ? '1px solid #a855f7' : '1px solid transparent',
              fontWeight: jumpStyle === 'dashed' ? '600' : 'normal'
            }}
          >
            Punteado
          </button>
          <button
            onClick={() => setJumpStyle('invisible')}
            style={{
              fontSize: '0.7rem',
              padding: '0.15rem 0.45rem',
              borderRadius: '5px',
              cursor: 'pointer',
              background: jumpStyle === 'invisible' ? 'rgba(168, 85, 247, 0.25)' : 'transparent',
              color: jumpStyle === 'invisible' ? '#c084fc' : '#9ca3af',
              border: jumpStyle === 'invisible' ? '1px solid #a855f7' : '1px solid transparent',
              fontWeight: jumpStyle === 'invisible' ? '600' : 'normal'
            }}
          >
            Invisible
          </button>
          <button
            onClick={() => setJumpStyle('solid')}
            style={{
              fontSize: '0.7rem',
              padding: '0.15rem 0.45rem',
              borderRadius: '5px',
              cursor: 'pointer',
              background: jumpStyle === 'solid' ? 'rgba(168, 85, 247, 0.25)' : 'transparent',
              color: jumpStyle === 'solid' ? '#c084fc' : '#9ca3af',
              border: jumpStyle === 'solid' ? '1px solid #a855f7' : '1px solid transparent',
              fontWeight: jumpStyle === 'solid' ? '600' : 'normal'
            }}
          >
            Continuo
          </button>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

