import React, { useEffect, useRef } from 'react';
import katex from 'katex';

export default function FormulaCard({ functionType, params }) {
  const formulaRef = useRef(null);

  const getLatexString = () => {
    const { A, f0, thetaDeg, t0, alpha, D } = params;
    switch (functionType) {
      case 'step':
        return `x(t) = ${A} \\cdot \\mu(t - ${t0}) \\quad \\text{donde } \\mu(t - t_0) = \\begin{cases} 0 & t < ${t0} \\\\ 1 & t \\ge ${t0} \\end{cases}`;
      case 'sine':
        return `x(t) = ${A} \\cdot \\sin(2\\pi \\cdot ${f0} \\cdot t + ${thetaDeg}^\\circ)`;
      case 'exponential':
        return `x(t) = ${A} \\cdot e^{${alpha} \\cdot (t - ${t0})}`;
      case 'damped':
        return `x(t) = ${A} \\cdot \\sin(2\\pi \\cdot ${f0} \\cdot t + ${thetaDeg}^\\circ) \\cdot e^{${alpha} \\cdot t}`;
      case 'pulse':
        return `p(t) = ${A} \\cdot [\\mu(t - ${t0}) - \\mu(t - ${t0 + D})]`;
      default:
        return '';
    }
  };

  useEffect(() => {
    if (formulaRef.current) {
      katex.render(getLatexString(), formulaRef.current, {
        throwOnError: false,
        displayMode: true
      });
    }
  }, [functionType, params]);

  return (
    <div className="glass-panel formula-card">
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Ecuación
      </div>
      <div ref={formulaRef} className="formula-math-render" />
    </div>
  );
}
