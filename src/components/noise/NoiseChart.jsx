import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';

const NoiseChart = ({ history, isLoading }) => {
  const [period, setPeriod] = useState('24');

  if (isLoading) {
    return (
      <div className="chart-loading">
        <div className="spinner"></div>
        <p>Chargement de l'historique...</p>
      </div>
    );
  }

  if (!history || !history.chartData || history.chartData.length === 0) {
    return (
      <div className="chart-empty">
        <BarChart className="icon large" />
        <h3>Aucune donnée disponible</h3>
        <p>Activez la surveillance pour collecter des données</p>
      </div>
    );
  }

  const data = history.chartData;

  const getBarColor = (status) => {
    switch(status) {
      case 'silence': return '#94a3b8';
      case 'normal': return '#22c55e';
      case 'elevated': return '#eab308';
      case 'very_high': return '#f97316';
      case 'danger': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-value">Moyenne: {payload[0].value} dB</p>
          <p className="tooltip-status">Statut: {payload[0].payload.status}</p>
          <p className="tooltip-readings">Lectures: {payload[0].payload.readings}</p>
        </div>
      );
    }
    return null;
  };

  const handleExport = () => {
    toast.success('Exportation en cours...');
  };

  return (
    <div className="noise-chart">
      <div className="chart-header">
        <h3>📊 Historique du bruit (24h)</h3>
        <div className="chart-actions">
          <button className="export-btn" onClick={handleExport}>
            <Download className="icon" /> Exporter
          </button>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="time" 
              angle={-45} 
              textAnchor="end" 
              height={60}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis 
              label={{ value: 'dB', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
              domain={[0, 120]}
              tick={{ fill: '#6b7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#22c55e' }}></span>
          <span>Normal (30-70 dB)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#eab308' }}></span>
          <span>Élevé (70-85 dB)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#f97316' }}></span>
          <span>Très élevé (85-100 dB)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#ef4444' }}></span>
          <span>Dangereux (100+ dB)</span>
        </div>
      </div>

      <div className="chart-stats">
        <div className="stat-item">
          <span className="stat-label">Moyenne</span>
          <span className="stat-value">{history.avgDb || 0} dB</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Min</span>
          <span className="stat-value">{history.minDb || 0} dB</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Max</span>
          <span className="stat-value">{history.maxDb || 0} dB</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Lectures</span>
          <span className="stat-value">{history.dataPoints || 0}</span>
        </div>
      </div>
    </div>
  );
};

// ✅ EXPORT PAR DÉFAUT - CORRECT
export default NoiseChart;