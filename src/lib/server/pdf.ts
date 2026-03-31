import pdfParse from 'pdf-parse/lib/pdf-parse'

const MAX_PDF_CHARS = Number(process.env.MAX_PDF_CHARS ?? '15000')

/**
 * Extract text content from a PDF buffer.
 * Equivalent to Python's `extract_pdf()`.
 */
export async function extractPdfText(pdfBuffer: Buffer): Promise<string> {
  const data = await pdfParse(pdfBuffer)

  let text = data.text?.trim() ?? ''

  if (text.length > MAX_PDF_CHARS) {
    text =
      text.slice(0, MAX_PDF_CHARS) + '\n\n...[ข้อความถูกตัดเนื่องจากยาวเกิน]'
  }

  return text
}
