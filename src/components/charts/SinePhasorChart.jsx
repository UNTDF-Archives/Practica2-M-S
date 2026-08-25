import React from 'react';
import { Line } from 'react-chartjs-2';

export default function SinePhasorChart({ data, A, f0, thetaDeg, isDiscrete }) {
  const { tVector, xVector } = data;

  const chartData = {
    labels: tVector.map(t => t.toFixed(2)),
    datasets: [
      {
        label: `Senoidal A=${A}, f0=${f0}Hz, θ=${thetaDeg}°`,
        data: xVector,
        borderColor: '#ec4899',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        borderWidth: 2.5,
        pointRadius: isDiscrete ? 4 : 0,
        pointBackgroundColor: '#ec4899',
        tension: 0.4,
        fill: true
      },
      // Líneas de referencia ±A
      {
        label: `+A (${A})`,
        data: Array(tVector.length).fill(A),
        borderColor: 'rgba(236, 72, 153, 0.3)',
        borderWidth: 1,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false
      },
      {
        label: `-A (-${A})`,
        data: Array(tVector.length).fill(-A),
        borderColor: 'rgba(236, 72, 153, 0.3)',
        borderWidth: 1,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#e5e7eb', font: { family: 'Inter', size: 11 } }
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
        suggestedMin: -A * 1.3,
        suggestedMax: A * 1.3
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
