// Simple client-side extractors for TXT, PDF (via pdfjs), and DOCX (via mammoth)
// Keeps bundle impact lower by using dynamic imports.

export async function extractTextFromPDFArrayBuffer(buf: ArrayBuffer): Promise<string> {
  const pdfjsLib: any = await import('pdfjs-dist');
  try {
    const workerUrlMod: any = await import('pdfjs-dist/build/pdf.worker.mjs?url');
    if (workerUrlMod?.default) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrlMod.default;
    }
  } catch {}
  const loadingTask = pdfjsLib.getDocument({ data: buf });
  const pdf = await loadingTask.promise;
  let fullText = '';
  const maxPages = Math.min(pdf.numPages, 50);
  for (let p = 1; p <= maxPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    const pageText = content.items.map((it: any) => it.str).join(' ');
    fullText += pageText + '\n';
  }
  return fullText;
}

export async function extractTextFromDOCXArrayBuffer(buf: ArrayBuffer): Promise<string> {
  const mammoth: any = await import('mammoth/mammoth.browser');
  const result = await mammoth.extractRawText({ arrayBuffer: buf });
  return String(result?.value || '');
}

export async function extractTextFromBlob(blob: Blob, nameHint?: string): Promise<string> {
  const name = (nameHint || '').toLowerCase();
  const type = blob.type.toLowerCase();
  if (type.startsWith('text/')) {
    return await blob.text();
  }
  const buf = await blob.arrayBuffer();
  if (type === 'application/pdf' || name.endsWith('.pdf')) {
    try { return await extractTextFromPDFArrayBuffer(buf); } catch { return ''; }
  }
  if (name.endsWith('.docx') || type.includes('officedocument.wordprocessingml.document')) {
    try { return await extractTextFromDOCXArrayBuffer(buf); } catch { return ''; }
  }
  return '';
}

export async function extractTextFromFile(file: File): Promise<string> {
  const type = file.type.toLowerCase();
  const name = (file.name || '').toLowerCase();
  if (type.startsWith('text/')) {
    return await file.text();
  }
  const buf = await file.arrayBuffer();
  if (type === 'application/pdf' || name.endsWith('.pdf')) {
    try { return await extractTextFromPDFArrayBuffer(buf); } catch { return ''; }
  }
  if (name.endsWith('.docx') || type.includes('officedocument.wordprocessingml.document')) {
    try { return await extractTextFromDOCXArrayBuffer(buf); } catch { return ''; }
  }
  return '';
}