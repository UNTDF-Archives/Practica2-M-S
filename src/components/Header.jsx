import React from 'react';
import { Activity, Grid, Monitor } from 'lucide-react';

export default function Header({ viewMode, setViewMode }) {
  return (
    <header className="glass-panel app-header">
      <div className="header-brand">
        <div className="header-logo">
          <Activity size={24} />
        </div>
        <div>
          <h1 className="header-title">Visualizador de Funciones Continuas</h1>
        </div>
      </div>

      <div className="view-mode-tabs">
        <button
          onClick={() => setViewMode('single')}
          className={`view-tab-btn ${viewMode === 'single' ? 'active' : ''}`}
        >
          <Monitor size={16} />
          <span>Vista Individual</span>
        </button>
        <button
          onClick={() => setViewMode('grid')}
          className={`view-tab-btn ${viewMode === 'grid' ? 'active' : ''}`}
        >
          <Grid size={16} />
          <span>Dashboard (5 Gráficas)</span>
        </button>
      </div>
    </header>
  );
}
