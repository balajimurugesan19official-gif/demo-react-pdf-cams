import React, { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { setFields } from '../store/formSlice';
import { extractFieldsFromPDF } from '../utils/aiExtractor';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export default function PDFViewer({ file }: { file: File }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const focusedField = useSelector((s: RootState) => s.focus.focusedField);
  const fields = useSelector((s: RootState) => s.form.fields) as any[];
  const [numPages, setNumPages] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  // 🧠 Extract fields only once when file changes
  useEffect(() => {
    if (!file) return;
    (async () => {
      setLoading(true);
      try {
        const extracted = await extractFieldsFromPDF(file);
        console.log('✅ Extracted fields:', extracted);
        dispatch(setFields(extracted));
      } catch (err) {
        console.error('❌ Extraction failed:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [file, dispatch]);

  // 🔦 Scroll into view when form field is focused
  useEffect(() => {
    if (!focusedField || !containerRef.current) return;
    const field = fields?.find((x) => x.id === focusedField);
    if (!field || !field.bbox) return;

    const { page = 1 } = field.bbox;
    const pageNode = containerRef.current.querySelectorAll('.react-pdf__Page')[
      page - 1
    ] as HTMLElement;
    if (pageNode)
      pageNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [focusedField, fields]);

  return (
    <div className="h-full relative">
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-gray-600 text-sm z-50">
          Extracting fields from PDF...
        </div>
      )}

      <div ref={containerRef} className="overflow-auto h-full relative">
        <Document file={file as any} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from({ length: numPages }).map((_, i) => (
            <div key={i} className="relative mb-4">
              <Page
                pageNumber={i + 1}
                width={800}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />

              {/* Render highlights for extracted fields */}
              {fields
                ?.filter((f) => f.bbox?.page === i + 1)
                .map((f) => (
                  <PDFFieldHighlight
                    key={f.id}
                    field={f}
                    isFocused={focusedField === f.id}
                  />
                ))}
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
}

function PDFFieldHighlight({ field, isFocused }: any) {
  const bbox = field.bbox;
  if (!bbox) return null;

  const scale = 800 / 595; // A4 width scale
  const style: React.CSSProperties = {
    position: 'absolute',
    top: bbox.y * scale,
    left: bbox.x * scale,
    width: bbox.width * scale,
    height: bbox.height * scale,
    border: isFocused ? '2px solid #2563EB' : '1px dashed rgba(0,0,0,0.25)',
    background: isFocused ? 'rgba(37,99,235,0.18)' : 'transparent',
    borderRadius: 4,
    transition: 'all 200ms ease',
    zIndex: isFocused ? 50 : 20,
  };

  return <div style={style} className="absolute pointer-events-none" />;
}
