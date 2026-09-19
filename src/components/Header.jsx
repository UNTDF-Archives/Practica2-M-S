import React from 'react';
import { Activity } from 'lucide-react';

export default function Header() {
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
      <div style={{ textAlign: 'right', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Modelos y Simulación 2026</div>
        <div>Constanza Benedetti &bull; Lucas Araya</div>
      </div>
    </header>
  );
}
