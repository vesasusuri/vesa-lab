#!/usr/bin/env node
import { readFileSync } from 'fs';
import puppeteer from 'puppeteer';

const [htmlPath, pdfPath] = process.argv.slice(2);

if (!htmlPath || !pdfPath) {
  console.error('Usage: node scripts/generate-cv-pdf.mjs <input.html> <output.pdf>');
  process.exit(1);
}

const html = readFileSync(htmlPath, 'utf8');

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
});

try {
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.emulateMediaType('print');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' },
  });
} finally {
  await browser.close();
}
