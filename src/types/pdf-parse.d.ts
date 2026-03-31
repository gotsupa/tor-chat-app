declare module 'pdf-parse/lib/pdf-parse' {
  interface PdfData {
    info: Record<string, unknown>
    metadata: Record<string, unknown>
    numpages: number
    text: string
    version: string
  }

  function pdf(dataBuffer: Buffer): Promise<PdfData>

  export default pdf
}
