import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  BarElement,
  BarController,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
} from 'chart.js';

ChartJS.register(BarController, BarElement, CategoryScale, LinearScale, LineController, LineElement, PointElement, Tooltip, Legend);

const barColor = (hours) => {
  if (hours >= 8) return '#fa8bac';      // pink
  if (hours >= 7) return '#006400';      // Dark Green
  if (hours >= 5) return '#A8D672';      // Pista Green
  if (hours >= 4) return '#FF9800';      // Orange
  if (hours >= 2) return '#E53935';      // Red
  return '#8B0000';                      // Dark Red (0–<3 hrs)
};

export function MonthlyChart({ stats, goal, month = new Date() }) {
  const current = month;
  const dayCount = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: dayCount }, (_, index) => {
    const date = new Date(current.getFullYear(), current.getMonth(), index + 1).toLocaleDateString('en-CA');
    const stat = stats.find(item => item.date === date) || {};
    return { date, label: index + 1, total: (stat.totalSeconds || 0) / 3600, laptop: (stat.laptopSeconds || 0) / 3600, offline: (stat.offlineSeconds || 0) / 3600, sessions: stat.sessionCount || 0 };
  });

  return <Bar data={{ labels: days.map(day => day.label), datasets: [
    { type: 'bar', label: 'Study hours', data: days.map(day => day.total), backgroundColor: days.map(day => barColor(day.total)), borderRadius: 4 },
    { type: 'line', label: 'Daily goal', data: days.map(() => goal), borderColor: '#315efb', borderDash: [5, 4], borderWidth: 1.5, pointRadius: 0 }
  ] }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { title: context => days[context[0].dataIndex].date, label: context => `Total: ${context.raw.toFixed(1)}h`, afterBody: context => { const day = days[context[0].dataIndex]; return [`Laptop: ${day.laptop.toFixed(1)}h`, `Offline: ${day.offline.toFixed(1)}h`, `Sessions: ${day.sessions}`, `Goal achieved: ${day.total >= goal ? 'Yes' : 'No'}`]; } } } }, scales: { x: { grid: { display: false }, ticks: { maxTicksLimit: 12 } }, y: { beginAtZero: true, ticks: { callback: value => `${value}h` } } } }} />;
}
