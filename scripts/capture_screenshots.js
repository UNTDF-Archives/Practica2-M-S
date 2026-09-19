import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('./reporte/capturas');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function capture() {
  console.log('Iniciando Chromium...');
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({
    viewport: { width: 1366, height: 900 },
    deviceScaleFactor: 2
  });

  console.log('Navegando a http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Senoidal (por defecto está seleccionada)
  console.log('Capturando función Senoidal...');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_seno.png') });

  // 2. Escalón Unitario
  console.log('Capturando función Escalón...');
  await page.getByText('1. Escalón Unitario').click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_escalon.png') });

  // 3. Exponencial
  console.log('Capturando función Exponencial...');
  await page.getByText('3. Exponencial').click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_exponencial.png') });

  // 4. Señal Amortiguada
  console.log('Capturando función Señal Amortiguada...');
  await page.getByText('4. Señal Amortiguada').click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_amortiguada.png') });

  // 5. Pulso Recortado
  console.log('Capturando función Pulso...');
  await page.getByText('5. Pulso Recortado').click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_pulso.png') });

  // 6. Modo Discreto (en Pulso)
  console.log('Capturando Muestreo Discreto...');
  const discreteToggle = page.getByRole('button', { name: /Continuo|Discreto/i }).first();
  await discreteToggle.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_modo_discreto.png') });

  // 7. Inspector de Vectores y Métricas
  console.log('Capturando Inspector de Vectores...');
  await page.setViewportSize({ width: 1366, height: 1100 });
  await discreteToggle.click(); // volver a continuo
  await page.waitForTimeout(400);
  await page.getByText('Tabla de Vectores (Dominio e Imagen)').click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_inspector_vectores.png') });

  await browser.close();
  console.log('¡Todas las capturas se guardaron exitosamente en ' + SCREENSHOT_DIR + '!');
}

capture().catch(err => {
  console.error('Error al capturar:', err);
  process.exit(1);
});
