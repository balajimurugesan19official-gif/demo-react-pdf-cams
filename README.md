# PDF Form Extractor - SDE3 Frontend Evaluation

A React-based frontend tool that reads a filled bank-style PDF form using AI and provides an interactive experience with synchronized PDF and form field interaction.

## Features

### Core Requirements

- **PDF Display**: Renders a bank-style PDF form with visual field overlays
- **Dynamic Form Generation**: Creates form fields dynamically from a JSON schema extracted via AI
- **Focus Synchronization**: Highlights and zooms to PDF fields when form inputs are focused
- **Field Types Support**: Supports text, number, email, date, and checkbox field types
- **State Management**: Uses Redux Toolkit for global form state and focus state management

### Bonus Features Implemented

- **Form Validation**: Implements Zod schema validation with real-time error feedback
- **Smooth Animations**: Uses Framer Motion for elegant transitions and micro-interactions
- **Enhanced UI**: Modern, professional design with Tailwind CSS
- **Field Highlighting**: Bounding boxes with smooth animations and visual emphasis
- **Auto-scroll**: Automatically scrolls to focused field in PDF viewer

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Zod** - Form validation
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vite** - Build tool

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd project
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Build for production
```bash
npm run build
```

5. Preview production build
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── PDFViewer.tsx       # PDF rendering with bounding box overlays
│   └── DynamicForm.tsx     # Dynamic form generator with validation
├── store/
│   ├── store.ts            # Redux store configuration
│   ├── formSlice.ts        # Form state management
│   ├── focusSlice.ts       # Focus state management
│   └── hooks.ts            # Typed Redux hooks
├── data/
│   └── mockFormData.ts     # Mock AI-extracted field data
├── utils/
│   └── pdfGenerator.ts     # Mock PDF document generator
├── validation/
│   └── formSchema.ts       # Zod validation schema
└── App.tsx                 # Main application component
```

## Approach

### 1. State Management Strategy

The application uses Redux Toolkit with two separate slices:

- **formSlice**: Manages form field definitions and values
  - Stores the JSON schema of fields extracted from PDF
  - Tracks user input values for each field
  - Provides actions for field updates

- **focusSlice**: Manages UI focus state
  - Tracks which field is currently focused
  - Enables synchronization between form and PDF viewer

This separation ensures clean state management and easy debugging.

### 2. PDF Rendering & Interaction

- Uses Canvas API to generate a mock filled bank form PDF
- Overlays bounding boxes on detected fields using absolute positioning
- Implements focus-driven highlighting with Framer Motion animations
- Scrolls focused field into view automatically

### 3. Dynamic Form Rendering

- Reads field definitions from JSON schema
- Dynamically renders appropriate input types
- Applies validation rules from Zod schema
- Shows real-time validation errors
- Syncs with PDF viewer on focus/blur events

### 4. Field Type Support

The application supports 5+ field types:
1. **Text** - Full name, branch code, phone number
2. **Number** - Account number
3. **Email** - Email address with validation
4. **Date** - Date of birth picker
5. **Checkbox** - Terms and conditions agreement

## Real AI-Based Field Extraction

For production implementation with actual AI-based field extraction:

### Recommended Approach

1. **Backend Service**: Deploy a serverless function (e.g., Supabase Edge Function) that:
   - Accepts PDF file upload
   - Uses OCR (Tesseract.js, Google Vision API, AWS Textract)
   - Detects form fields using ML models (LayoutLM, BERT-based)
   - Extracts field positions, labels, and values
   - Returns structured JSON with bounding boxes

2. **AI Model Integration**:
   - Use pre-trained document understanding models
   - Fine-tune on bank form datasets
   - Implement field classification (text, number, date, etc.)
   - Extract relationships between labels and values

3. **Frontend Updates**:
   - Add file upload component
   - Show loading state during AI processing
   - Render actual PDF using react-pdf
   - Map AI-extracted coordinates to PDF canvas

4. **Data Structure**:
```typescript
interface AIExtractedField {
  id: string;
  type: 'text' | 'number' | 'email' | 'date' | 'checkbox';
  label: string;
  value: string | boolean;
  confidence: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
    page: number;
  };
}
```

5. **Enhancement Opportunities**:
   - Implement confidence thresholds for AI predictions
   - Allow manual correction of misdetected fields
   - Store field mappings for similar forms
   - Support multi-page documents
   - Add export functionality (JSON, CSV)

## Features Demo

1. **Focus Sync**: Click any form field to see the corresponding PDF field highlight
2. **Validation**: Try submitting with invalid data to see error messages
3. **Animations**: Observe smooth transitions when focusing fields
4. **Auto-scroll**: Notice PDF auto-scrolling to focused field
5. **Form Submission**: Fill all required fields correctly to see success message

## Future Enhancements

- Real PDF file upload and parsing
- Multi-page PDF support
- Export filled form as new PDF
- Field mapping templates for common form types
- Collaborative editing features
- Cloud storage integration
