/* ================================================================
   Quootami — PDF Converter
   ================================================================
   Converte file caricati dall'utente in PDF prima dell'invio:
   - JPG/PNG/WebP → PDF (singola pagina, immagine inserita)
   - HEIC/HEIF (iPhone) → JPEG → PDF
   - PDF originale → resta PDF (non viene riconvertito)

   Compressione: JPEG quality 0.85 prima di inserire nel PDF
   per ridurre la dimensione totale e rispettare i limiti email
   (Web3Forms free: ~10 MB totali per email).

   Richiede jsPDF (window.jspdf.jsPDF) e opzionalmente heic2any
   (window.heic2any) caricati dalla pagina.
   ================================================================ */

(function () {
  'use strict';

  var TARGET_MAX_DIM = 1800;      // max larghezza/altezza in pixel (per ridurre la dimensione)
  var JPEG_QUALITY = 0.85;        // qualità compressione JPEG (0-1)
  var IMAGE_TYPES = ['image/jpeg','image/jpg','image/png','image/webp'];
  var HEIC_TYPES = ['image/heic','image/heif'];

  // === Helpers ===

  function isImage(file) {
    return IMAGE_TYPES.indexOf(file.type) >= 0 ||
           /\.(jpe?g|png|webp)$/i.test(file.name);
  }
  function isHeic(file) {
    return HEIC_TYPES.indexOf(file.type) >= 0 ||
           /\.heic$|\.heif$/i.test(file.name);
  }
  function isPdf(file) {
    return file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
  }

  // Converte File HEIC in Blob JPEG usando heic2any
  async function heicToJpeg(file) {
    if (!window.heic2any) {
      throw new Error('Libreria HEIC non caricata');
    }
    var blob = await window.heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: JPEG_QUALITY
    });
    return blob instanceof Blob ? blob : blob[0];
  }

  // Carica immagine in <img> per leggerla
  function loadImage(blob) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      var url = URL.createObjectURL(blob);
      img.onload = function () {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = function (e) {
        URL.revokeObjectURL(url);
        reject(new Error('Impossibile leggere immagine'));
      };
      img.src = url;
    });
  }

  // Ridimensiona e converte immagine in dataURL JPEG compresso
  function resizeAndCompress(img) {
    var w = img.naturalWidth, h = img.naturalHeight;
    // Limita dimensione mantenendo proporzioni
    if (w > TARGET_MAX_DIM || h > TARGET_MAX_DIM) {
      var ratio = Math.min(TARGET_MAX_DIM / w, TARGET_MAX_DIM / h);
      w = Math.round(w * ratio);
      h = Math.round(h * ratio);
    }
    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    return {
      dataUrl: canvas.toDataURL('image/jpeg', JPEG_QUALITY),
      width: w,
      height: h
    };
  }

  // Costruisce un PDF da un dataURL immagine
  // Restituisce un Blob di tipo application/pdf
  function imageToPdf(dataUrl, imgW, imgH) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      throw new Error('Libreria jsPDF non caricata');
    }
    var jsPDF = window.jspdf.jsPDF;

    // A4 in punti: 595 x 842
    var pageW = 595, pageH = 842, margin = 20;
    var maxW = pageW - 2 * margin, maxH = pageH - 2 * margin;

    var aspect = imgW / imgH;
    var pdfW, pdfH;
    if (aspect > maxW / maxH) {
      // Immagine larga: limita per larghezza
      pdfW = maxW;
      pdfH = maxW / aspect;
    } else {
      pdfH = maxH;
      pdfW = maxH * aspect;
    }
    var offX = (pageW - pdfW) / 2;
    var offY = (pageH - pdfH) / 2;

    var doc = new jsPDF({
      orientation: pageW > pageH ? 'landscape' : 'portrait',
      unit: 'pt',
      format: [pageW, pageH],
      compress: true
    });
    doc.addImage(dataUrl, 'JPEG', offX, offY, pdfW, pdfH, undefined, 'FAST');
    return doc.output('blob');
  }

  /**
   * Converte un File qualsiasi in PDF.
   * @param {File} file - File originale dell'utente
   * @param {string} suggestedName - Nome base per il file di output (senza estensione)
   * @returns {File} - File PDF risultante (oppure il PDF originale se gia' PDF)
   */
  async function convertToPdf(file, suggestedName) {
    var baseName = (suggestedName || file.name.replace(/\.[^.]+$/, '') || 'documento')
                     .replace(/[^a-zA-Z0-9_\-]/g, '_')
                     .slice(0, 60);

    // 1) Se e' gia' un PDF, lo rinomino e lo restituisco
    if (isPdf(file)) {
      return new File([file], baseName + '.pdf', { type: 'application/pdf' });
    }

    // 2) HEIC → JPEG
    var imageBlob = file;
    if (isHeic(file)) {
      try {
        imageBlob = await heicToJpeg(file);
      } catch (e) {
        throw new Error('Conversione HEIC fallita: ' + e.message);
      }
    } else if (!isImage(file)) {
      throw new Error('Formato non supportato: ' + (file.type || file.name));
    }

    // 3) Carica + ridimensiona + comprimi → dataURL JPEG
    var img = await loadImage(imageBlob);
    var compressed = resizeAndCompress(img);

    // 4) Crea PDF
    var pdfBlob = imageToPdf(compressed.dataUrl, compressed.width, compressed.height);

    return new File([pdfBlob], baseName + '.pdf', { type: 'application/pdf' });
  }

  // Espongo l'API
  window.QuootamiPDFConverter = {
    convertToPdf: convertToPdf,
    isImage: isImage,
    isHeic: isHeic,
    isPdf: isPdf
  };
})();
