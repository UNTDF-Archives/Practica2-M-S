import React from 'react';
import { TrendingUp, Waves, Zap, Activity, ShieldAlert } from 'lucide-react';

const SIGNALS = [
  { id: 'step', name: '1. Escalón Unitario', icon: TrendingUp, color: '#06b6d4' },
  { id: 'sine', name: '2. Senoidal', icon: Waves, color: '#ec4899' },
  { id: 'exponential', name: '3. Exponencial', icon: Zap, color: '#10b981' },
  { id: 'damped', name: '4. Señal Amortiguada', icon: Activity, color: '#6366f1' },
  { id: 'pulse', name: '5. Pulso Recortado', icon: ShieldAlert, color: '#a855f7' }
];

export default function SignalSelector({ activeSignal, onSelect }) {
  return (
    <div className="signal-selector">
      {SIGNALS.map((sig) => {
        const Icon = sig.icon;
        const isActive = activeSignal === sig.id;
        return (
          <button
            key={sig.id}
            onClick={() => onSelect(sig.id)}
            className={`signal-tab-btn ${isActive ? 'active' : ''}`}
            style={{ '--accent-color': sig.color }}
          >
            <Icon size={18} color={isActive ? sig.color : 'currentColor'} />
            <span>{sig.name}</span>
          </button>
        );
      })}
    </div>
  );
}
