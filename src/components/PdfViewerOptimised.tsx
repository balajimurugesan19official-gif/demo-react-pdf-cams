import React, { useEffect, useRef, useState, startTransition } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { setFields } from '../store/formSlice';
import { extractFieldsFromPDF } from '../utils/aiExtractor';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// ✅ Keep your existing working PDF.js worker configuration
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

  // ✅ Lazy rendering window: only show a few pages near viewport
  const [visibleRange, setVisibleRange] = useState({ start: 1, end: 3 });
  const [currentPage, setCurrentPage] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  // 🧠 Extract fields once when file changes
  useEffect(() => {
    if (!file) return;
    (async () => {
      setLoading(true);
      try {
        const extracted = await extractFieldsFromPDF(file);
        console.log('✅ Extracted fields:', extracted);

        // ✅ FIXED TYPE ERROR — wrapped dispatch in block to return void
        startTransition(() => {
          dispatch(setFields(extracted));
        });
      } catch (err) {
        console.error('❌ Extraction failed:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [file, dispatch]);

  // 🔦 Auto-scroll to PDF page when a field is focused
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

  // ✅ Scroll listener for lightweight lazy rendering
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const scrollTop = container.scrollTop;
      const pageHeight = 900; // Approx. height per page
      const start = Math.max(1, Math.floor(scrollTop / pageHeight) - 1);
      const end = Math.min(numPages, start + 4); // Render window = 4 pages max
      setVisibleRange({ start, end });

      const current = Math.min(
        numPages,
        Math.max(1, Math.ceil(scrollTop / pageHeight) + 1)
      );
      setCurrentPage(current);
    };

    container.addEventListener('scroll', onScroll);
    return () => container.removeEventListener('scroll', onScroll);
  }, [numPages]);

  return (
    <div className="h-full relative">
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-gray-600 text-sm z-50">
          Extracting fields from PDF...
        </div>
      )}

      <div
        ref={containerRef}
        className="overflow-auto h-full relative bg-gray-50"
      >
        <Document file={file as any} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from({ length: numPages }).map((_, i) => {
            const pageNumber = i + 1;

            // ✅ Render only visible pages (lazy load)
            if (
              pageNumber < visibleRange.start ||
              pageNumber > visibleRange.end
            ) {
              return (
                <div
                  key={i}
                  style={{ height: '900px' }}
                  className="flex items-center justify-center text-gray-400 text-sm border-b border-gray-200"
                >
                  Loading page...
                </div>
              );
            }

            return (
              <div key={i} className="relative mb-4 border shadow-sm bg-white">
                <Page
                  pageNumber={pageNumber}
                  width={800}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  scale={0.8} // ✅ reduced scale for smoother rendering
                />

                {/* Render bounding-box highlights for extracted fields */}
                {fields
                  ?.filter((f) => f.bbox?.page === pageNumber)
                  .map((f) => (
                    <PDFFieldHighlight
                      key={f.id}
                      field={f}
                      isFocused={focusedField === f.id}
                    />
                  ))}
              </div>
            );
          })}
        </Document>
      </div>

      {/* ✅ Floating Page Progress Indicator */}
      {numPages > 1 && (
        <div className="fixed bottom-3 right-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
          Page {currentPage} / {numPages}
        </div>
      )}
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
