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

export default function StepChart({ data, A, t0, isDiscrete }) {
  const { tVector, xVector } = data;
  const [jumpStyle, setJumpStyle] = useState('dashed'); // 'dashed' | 'invisible' | 'solid'

  const tMin = tVector && tVector.length > 0 ? tVector[0] : -2;
  const tMax = tVector && tVector.length > 0 ? tVector[tVector.length - 1] : 8;

  // Construcción de datasets según si es gráfico continuo o discreto
  let datasets = [];

  const safeTVector = tVector || [];

  if (isDiscrete) {
    datasets = [
      {
        label: `Escalón Discreto x[n] = ${A}·μ[n - ${t0}]`,
        data: safeTVector.map((t, idx) => ({ x: t, y: xVector[idx] })),
        borderColor: '#06b6d4',
        backgroundColor: '#06b6d4',
        borderWidth: 0,
        pointRadius: 4,
        pointBackgroundColor: '#06b6d4',
        showLine: false
      }
    ];
  } else {
    // 1. Tramo inferior (t < t0) -> y = 0
    const lowPoints = safeTVector.filter(t => t <= t0).map(t => ({ x: t, y: 0 }));
    if (!lowPoints.some(p => p.x === t0)) {
      lowPoints.push({ x: t0, y: 0 });
    }

    // 2. Tramo superior (t >= t0) -> y = A
    const highPoints = [{ x: t0, y: A }, ...safeTVector.filter(t => t > t0).map(t => ({ x: t, y: A }))];

    datasets.push(
      {
        label: `Tramo x(t) = 0`,
        data: lowPoints,
        borderColor: '#06b6d4',
        backgroundColor: 'transparent',
        borderWidth: 3,
        pointRadius: 0,
        tension: 0,
        fill: false
      },
      {
        label: `Escalón x(t) = ${A}·μ(t - ${t0})`,
        data: highPoints,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        borderWidth: 3,
        pointRadius: 0,
        tension: 0,
        fill: 'origin'
      }
    );
  }

  // Línea de salto vertical en t0 (tanto en continuo como en discreto si no es invisible)
  if (jumpStyle !== 'invisible') {
    datasets.push({
      label: `Salto Vertical`,
      data: [
        { x: t0, y: 0 },
        { x: t0, y: A }
      ],
      borderColor: jumpStyle === 'dashed' ? 'rgba(6, 182, 212, 0.8)' : '#06b6d4',
      borderWidth: jumpStyle === 'dashed' ? 2 : 3,
      borderDash: jumpStyle === 'dashed' ? [6, 6] : [],
      pointRadius: 0,
      tension: 0,
      fill: false
    });
  }

  // Marcadores de descontinuidad en t0 (Punto hueco en (t0, 0) y relleno en (t0, A))
  datasets.push({
    label: `Descontinuidad`,
    data: [
      { x: t0, y: 0 },
      { x: t0, y: A }
    ],
    borderColor: '#06b6d4',
    pointBackgroundColor: ['#0f172a', '#06b6d4'],
    pointBorderColor: '#06b6d4',
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
              legendItem.text.startsWith('Escalón') ||
              legendItem.text.startsWith('Escalón Discreto')
            );
          }
        }
      },
      tooltip: {
        callbacks: {
          title: (items) => items?.[0]?.parsed?.x !== undefined ? `Tiempo (t): ${Number(items[0].parsed.x).toFixed(2)} s` : '',
          label: (item) => item?.parsed?.y !== undefined ? `Imagen x(t): ${Number(item.parsed.y).toFixed(2)}` : ''
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
        title: { display: true, text: isDiscrete ? 'Amplitud x[n]' : 'Amplitud x(t)', color: '#9ca3af', font: { size: 10 } },
        suggestedMin: minY - yPadding,
        suggestedMax: maxY + yPadding
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Barra de controles superiores */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', padding: '0 0.25rem' }}>
        <div style={{ fontSize: '0.75rem', color: '#06b6d4', background: 'rgba(6, 182, 212, 0.1)', padding: '0.15rem 0.5rem', borderRadius: '6px', fontFamily: 'var(--font-mono)' }}>
          Salto en t₀ = {t0} s (Δx = {A})
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
              background: jumpStyle === 'dashed' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
              color: jumpStyle === 'dashed' ? '#38bdf8' : '#9ca3af',
              border: jumpStyle === 'dashed' ? '1px solid #06b6d4' : '1px solid transparent',
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
              background: jumpStyle === 'invisible' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
              color: jumpStyle === 'invisible' ? '#38bdf8' : '#9ca3af',
              border: jumpStyle === 'invisible' ? '1px solid #06b6d4' : '1px solid transparent',
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
              background: jumpStyle === 'solid' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
              color: jumpStyle === 'solid' ? '#38bdf8' : '#9ca3af',
              border: jumpStyle === 'solid' ? '1px solid #06b6d4' : '1px solid transparent',
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

