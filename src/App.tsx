// 🧠 UPDATED: Added file upload + live PDF and form rendering
import { useState } from 'react';
import PDFViewer from './components/PDFViewer';
import DynamicForm from './components/DynamicForm';

export default function App() {
  // 🆕 Local state to store uploaded PDF
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // 🆕 Handle PDF upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 🆕 Left Panel: PDF Viewer */}
      <div className="w-1/2 border-r flex flex-col">
        <div className="p-2 border-b bg-white">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-700"
          />
        </div>
        <div className="flex-1 overflow-auto">
          {pdfFile ? (
            <PDFViewer file={pdfFile} />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              Upload a PDF to start
            </div>
          )}
        </div>
      </div>

      {/* 🆕 Right Panel: Dynamic Form */}
      <div className="w-1/2 overflow-auto">
        {pdfFile ? (
          <DynamicForm file={pdfFile} />
        ) : (
          <div className="p-6 text-center text-gray-400">
            Form will appear here after PDF upload
          </div>
        )}
      </div>
    </div>
  );
}
