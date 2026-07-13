import 'pdfmake/build/pdfmake';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';

declare module 'pdfmake/build/pdfmake' {
  interface PdfMake {
    vfs: Record<string, string>;
    createPdf(docDefinition: TDocumentDefinitions): {
      download: (filename: string) => void;
      getBlob: (cb: (blob: Blob) => void) => void;
    };
  }
}
