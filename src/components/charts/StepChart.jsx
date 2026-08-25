import React from 'react';
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

  const chartData = {
    labels: tVector.map(t => t.toFixed(2)),
    datasets: [
      {
        label: `Escalón x(t) = ${A}·μ(t - ${t0})`,
        data: xVector,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        borderWidth: 3,
        stepped: !isDiscrete ? 'before' : false, // Stepped plot para función escalón
        pointRadius: isDiscrete ? 4 : 2,
        pointBackgroundColor: '#06b6d4',
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
      },
      tooltip: {
        callbacks: {
          title: (items) => `Tiempo (t): ${items[0].label} s`,
          label: (item) => `Imagen x(t): ${item.formattedValue}`
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
        },
        title: { display: true, text: 'Tiempo t (s)', color: '#9ca3af', font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.06)' },
        ticks: { color: '#9ca3af', font: { family: 'Fira Code', size: 10 } },
        title: { display: true, text: 'Amplitud x(t)', color: '#9ca3af', font: { size: 10 } },
        suggestedMin: -0.5,
        suggestedMax: Math.max(A * 1.2, 1.5)
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
