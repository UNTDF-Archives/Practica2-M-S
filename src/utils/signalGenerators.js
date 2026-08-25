/**
 * Módulo de generación de funciones continuas digitalizadas para TP2 - Modelos y Simulación 2026.
 */

// 1. Escalón Unitario: x(t) = A * mu(t - t0)
export function calculateStep(t, A, t0) {
  return t < t0 ? 0 : A;
}

// 2. Seno: x(t) = A * sin(2*pi*f0*t + theta)
export function calculateSine(t, A, f0, thetaRad) {
  return A * Math.sin(2 * Math.PI * f0 * t + thetaRad);
}

// 3. Exponencial: x(t) = A * exp(alpha * (t - t0))
export function calculateExponential(t, A, alpha, t0) {
  return A * Math.exp(alpha * (t - t0));
}

// 4. Señal Amortiguada: x(t) = A * sin(2*pi*f0*t + theta) * exp(alpha * t)
export function calculateDampedSine(t, A, f0, thetaRad, alpha) {
  return A * Math.sin(2 * Math.PI * f0 * t + thetaRad) * Math.exp(alpha * t);
}

// Envolvente para Señal Amortiguada: ± A * exp(alpha * t)
export function calculateDampedEnvelope(t, A, alpha) {
  return A * Math.exp(alpha * t);
}

// 5. Pulso Recortado: p(t) = A * [mu(t - t0) - mu(t - t0 - D)]
export function calculatePulse(t, A, t0, D) {
  return (t >= t0 && t <= t0 + D) ? A : 0;
}

/**
 * Genera los vectores de Dominio (T) e Imagen (X) para una función dada.
 */
export function generateSignalData({
  functionType,
  A = 1,
  f0 = 1,
  thetaDeg = 0,
  t0 = 0,
  alpha = -0.5,
  D = 2,
  tMin = -2,
  tMax = 8,
  numPoints = 200
}) {
  const thetaRad = (thetaDeg * Math.PI) / 180;
  const dt = (tMax - tMin) / (numPoints - 1);

  const tVector = [];
  const xVector = [];
  const envelopeUpper = [];
  const envelopeLower = [];

  for (let i = 0; i < numPoints; i++) {
    const t = tMin + i * dt;
    // Redondear t para evitar errores de precisión de punto flotante en display
    const tRounded = Number(t.toFixed(4));
    tVector.push(tRounded);

    let val = 0;
    switch (functionType) {
      case 'step':
        val = calculateStep(t, A, t0);
        break;
      case 'sine':
        val = calculateSine(t, A, f0, thetaRad);
        break;
      case 'exponential':
        val = calculateExponential(t, A, alpha, t0);
        break;
      case 'damped':
        val = calculateDampedSine(t, A, f0, thetaRad, alpha);
        const env = calculateDampedEnvelope(t, A, alpha);
        envelopeUpper.push(Number(env.toFixed(4)));
        envelopeLower.push(Number((-env).toFixed(4)));
        break;
      case 'pulse':
        val = calculatePulse(t, A, t0, D);
        break;
      default:
        val = 0;
    }
    xVector.push(Number(val.toFixed(4)));
  }

  // Métricas del vector de salida
  const xMin = Math.min(...xVector);
  const xMax = Math.max(...xVector);
  const xPeakPeak = xMax - xMin;
  const xMean = xVector.reduce((acc, v) => acc + v, 0) / xVector.length;
  const xRms = Math.sqrt(xVector.reduce((acc, v) => acc + v * v, 0) / xVector.length);

  return {
    tVector,
    xVector,
    envelopeUpper,
    envelopeLower,
    dt: Number(dt.toFixed(4)),
    metrics: {
      min: Number(xMin.toFixed(4)),
      max: Number(xMax.toFixed(4)),
      peakToPeak: Number(xPeakPeak.toFixed(4)),
      mean: Number(xMean.toFixed(4)),
      rms: Number(xRms.toFixed(4)),
      count: numPoints
    }
  };
}


