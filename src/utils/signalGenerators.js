// Lógica matemática para generar los vectores de tiempo e imagen de cada función.

// Escalón unitario: si t es menor a t0 da 0, si t llega o supera t0 se activa en la amplitud A
export function calculateStep(t, A, t0) {
  return t < t0 ? 0 : A;
}

// Senoidal clásica: A * sen(2*pi*f0*t + fase)
export function calculateSine(t, A, f0, thetaRad) {
  return A * Math.sin(2 * Math.PI * f0 * t + thetaRad);
}

// Exponencial: A * e^(alpha * (t - t0))
export function calculateExponential(t, A, alpha, t0) {
  return A * Math.exp(alpha * (t - t0));
}

// Seno amortiguado: junta la oscilación senoidal con la caída o crecimiento exponencial
export function calculateDampedSine(t, A, f0, thetaRad, alpha) {
  return A * Math.sin(2 * Math.PI * f0 * t + thetaRad) * Math.exp(alpha * t);
}

// Calculo el techo y piso (+A*e^alpha*t y -A*e^alpha*t) para dibujar las líneas punteadas de la envolvente
export function calculateDampedEnvelope(t, A, alpha) {
  return A * Math.exp(alpha * t);
}

// Pulso cuadrado: vale A únicamente cuando t está metido entre t0 y (t0 + D)
export function calculatePulse(t, A, t0, D) {
  return (t >= t0 && t <= t0 + D) ? A : 0;
}

// Función principal que arma los arreglos del dominio (t) y la imagen (x) según los parámetros de los sliders
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
  // Paso la fase de grados a radianes para que Math.sin trabaje bien
  const thetaRad = (thetaDeg * Math.PI) / 180;
  // Calculo el paso temporal dt entre cada muestra
  const dt = (tMax - tMin) / (numPoints - 1);

  const tVector = [];
  const xVector = [];
  const envelopeUpper = [];
  const envelopeLower = [];

  // Recorro desde tMin a tMax calculando cada punto
  for (let i = 0; i < numPoints; i++) {
    const t = tMin + i * dt;
    // Redondeo a 4 decimales para que no se llene de decimales feos en pantalla
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

  // Saco las métricas básicas de la señal (mínimo, máximo, promedio y valor eficaz RMS)
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
