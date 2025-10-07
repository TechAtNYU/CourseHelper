interface PdfTextItem {
  str?: string;
  [key: string]: unknown;
}

async function getPdfJs() {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  return pdfjs;
}

export async function extractPdfText(file: File) {
  const pdfjs = await getPdfJs();
  const buf = await file.arrayBuffer();
  const task = pdfjs.getDocument({ data: buf });
  const pdf = await task.promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const line = content.items
      .map((it: PdfTextItem) => it.str ?? "")
      .filter(Boolean)
      .join(" ");
    text += `${line}\n\n`;
  }

  return text.trim();
}

export async function isDegreeProgressReport(file: File) {
  const pdfjs = await getPdfJs();
  const buf = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buf }).promise;
  const page1 = await pdf.getPage(1);
  const content = await page1.getTextContent();
  const pageText = content.items
    .map((it: PdfTextItem) => it.str ?? "")
    .join(" ")
    .toLowerCase();

  return pageText.includes("degree progress report");
}

export async function extractCourseHistory(file: File) {
  const full = await extractPdfText(file);
  const normalized = full.replace(/\u00A0/g, " ");
  const idx = normalized.toLowerCase().indexOf("course history");
  if (idx === -1) {
    throw new Error(`"Course History" heading not found in this PDF.`);
  }
  return normalized.slice(idx).trim();
}
