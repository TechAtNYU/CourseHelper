import * as pdfjs from "pdfjs-dist";

// point PDF.js to its web worker
pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.149/build/pdf.worker.min.mjs";

export async function extractPdfText(file: File) {
  const buf = await file.arrayBuffer();
  const task = pdfjs.getDocument({ data: buf });
  const pdf = await task.promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const line = content.items
      .map((it: any) => ("str" in it ? it.str : ""))
      .filter(Boolean)
      .join(" ");
    text += line + "\n\n";
  }

  return text.trim();
}

export async function isDegreeProgressReport(file: File) {
  const buf = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buf }).promise;
  const page1 = await pdf.getPage(1);
  const content = await page1.getTextContent();
  const pageText = content.items
    .map((it: any) => ("str" in it ? it.str : ""))
    .join(" ")
    .toLowerCase();

  return pageText.includes("degree progress report");
}
