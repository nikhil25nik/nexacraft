import fs from "fs";
import { PDFDocument } from "pdf-lib";


export const extractPdfText = async (filePath) => {
  const pdfBytes = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  let text = "";

  const pages = pdfDoc.getPages();
  for (const page of pages) {
    const content = page.getTextContent?.();
    if (content && content.items) {
      text += content.items.map(item => item.str).join(" ");
    }
  }

  return text;
};
