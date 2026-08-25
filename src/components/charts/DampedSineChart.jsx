import React from 'react';
import { Line } from 'react-chartjs-2';

export default function DampedSineChart({ data, A, f0, thetaDeg, alpha, isDiscrete }) {
  const { tVector, xVector, envelopeUpper, envelopeLower } = data;

  const chartData = {
    labels: tVector.map(t => t.toFixed(2)),
    datasets: [
      {
        label: `Señal Amortiguada x(t)`,
        data: xVector,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 2.5,
        pointRadius: isDiscrete ? 4 : 0,
        pointBackgroundColor: '#6366f1',
        tension: 0.35,
        fill: false
      },
      {
        label: `Envolvente Superior (+A·e^αt)`,
        data: envelopeUpper,
        borderColor: '#f59e0b',
        borderWidth: 1.5,
        borderDash: [6, 6],
        pointRadius: 0,
        fill: false
      },
      {
        label: `Envolvente Inferior (-A·e^αt)`,
        data: envelopeLower,
        borderColor: '#f59e0b',
        borderWidth: 1.5,
        borderDash: [6, 6],
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
      },
      tooltip: {
        callbacks: {
          title: (items) => `Tiempo (t): ${items[0].label} s`,
          label: (item) => `${item.dataset.label}: ${item.formattedValue}`
        }
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
        ticks: { color: '#9ca3af', font: { family: 'Fira Code', size: 10 } }
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
