/**
 * Quootami — Utility PDF server-side
 * ============================================================
 * Converte immagini in PDF prima di allegarle all'email.
 * Usa pdf-lib (puro JS, no binari nativi).
 *
 * Supporta: JPEG, PNG, WebP, PDF (passa attraverso).
 * Non supporta: HEIC (richiede heif-convert, troppo pesante).
 *
 * NB: questo file è destinato a girare solo lato server
 *     (API routes Node.js runtime).
 * ============================================================
 */
import { PDFDocument, PageSizes } from 'pdf-lib';

const MAX_IMG_PIXELS = 1800;

/**
 * Converte un file (immagine o PDF) in un Buffer PDF singolo.
 * - Se è già PDF → restituisce il buffer originale
 * - Se è immagine → la wrap in un PDF A4 con margini
 */
export async function fileToPdf(
  buffer: Buffer,
  mimeType: string,
  filename: string
): Promise<Buffer> {
  // 1) Se è già PDF, restituisci com'è
  if (mimeType === 'application/pdf' || filename.toLowerCase().endsWith('.pdf')) {
    return buffer;
  }

  // 2) Crea PDF nuovo A4
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage(PageSizes.A4);
  const { width: pageW, height: pageH } = page.getSize();
  const margin = 20;
  const maxW = pageW - 2 * margin;
  const maxH = pageH - 2 * margin;

  // 3) Embed immagine
  let img;
  try {
    if (
      mimeType === 'image/jpeg' ||
      mimeType === 'image/jpg' ||
      /\.jpe?g$/i.test(filename)
    ) {
      img = await pdfDoc.embedJpg(buffer);
    } else if (mimeType === 'image/png' || /\.png$/i.test(filename)) {
      img = await pdfDoc.embedPng(buffer);
    } else {
      // Altri formati non supportati direttamente da pdf-lib (WebP, HEIC, ecc.)
      // Ritorniamo il buffer originale come "fallback": l'email lo riceverà
      // con il MIME type originale.
      return buffer;
    }
  } catch (e) {
    console.error('[pdf-utils] embed image failed:', e);
    return buffer; // fallback: spedisci originale
  }

  const ratio = img.width / img.height;
  let drawW: number;
  let drawH: number;
  if (ratio > maxW / maxH) {
    drawW = maxW;
    drawH = maxW / ratio;
  } else {
    drawH = maxH;
    drawW = maxH * ratio;
  }
  const offX = (pageW - drawW) / 2;
  const offY = (pageH - drawH) / 2;

  page.drawImage(img, { x: offX, y: offY, width: drawW, height: drawH });

  const out = await pdfDoc.save();
  return Buffer.from(out);
}

/**
 * Costruisce nome file PDF "pulito" per allegato email.
 */
export function buildPdfFilename(prefix: string, originalName: string): string {
  const base = (prefix || 'documento')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .slice(0, 60);
  return `${base}.pdf`;
}
