import { chromium } from 'playwright-core';
import path from 'path';
import fs from 'fs';

async function generatePdf() {
  console.log('Iniciando generación de PDF con Chromium...');
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();

  const htmlPath = path.resolve('./reporte/tp2_informe.html');
  console.log('Cargando archivo HTML:', htmlPath);
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });

  // Asegurar que todas las imágenes estén renderizadas
  await page.waitForTimeout(1000);

  const outputPath = path.resolve('./TP2_Resolucion_Modelos_y_Simulacion.pdf');
  console.log('Imprimiendo a PDF en:', outputPath);

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '12mm',
      bottom: '12mm',
      left: '12mm',
      right: '12mm'
    }
  });

  await browser.close();
  console.log('¡PDF generado con éxito en:', outputPath);
}

generatePdf().catch(err => {
  console.error('Error al generar PDF:', err);
  process.exit(1);
});
