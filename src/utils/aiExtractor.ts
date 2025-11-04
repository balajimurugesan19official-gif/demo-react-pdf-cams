// src/utils/aiExtractor.ts
// ✅ JSON-driven extractor with future AI integration (commented)

import * as formSchema from '../data/formSchema.json';
import { ExtractedFieldListSchema } from './validation'; // ✅ Zod schema import

export interface ExtractedField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'checkbox' | 'checkbox-group' | 'date';
  value?: string | number | boolean;
  options?: { label: string; value: boolean }[];
  bbox?: { page: number; x: number; y: number; width: number; height: number };
}

export async function extractFieldsFromPDF(
  file: File
): Promise<ExtractedField[]> {
  console.log(`📄 Extracting fields from local JSON for file: ${file.name}`);

  await new Promise((r) => setTimeout(r, 800)); // Simulated API delay

  // Handle JSON import compatibility across environments
  const fields = ((formSchema as any).default ||
    formSchema) as ExtractedField[];
  console.log('✅ Loaded fields from JSON:', fields);

  // ✅ Validate using Zod schema before returning
  const parsed = ExtractedFieldListSchema.safeParse(fields);
  if (!parsed.success) {
    console.error('Zod validation failed:', parsed.error.format());
    throw new Error('Invalid field structure from extractor');
  }

  console.log(' Zod validation passed');
  return parsed.data;

  /* 
  ====================== FUTURE: AI-BASED EXTRACTION ======================

  // Uncomment and configure when ready to use OpenAI GPT-4.1 Vision.

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) throw new Error('❌ Missing OpenAI API key');

  const base64 = await fileToBase64(file);

  const prompt = `
  You are an AI OCR agent that reads a scanned or filled PDF form.
  Detect all form fields and their filled values.
  Return ONLY valid JSON like:
  [
    { "id": "account_holder_name", "label": "Account Holder Name", "type": "text", "value": "John Doe" },
    { "id": "account_number", "label": "Account Number", "type": "number", "value": "1234567890" }
  ]
  `;

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4.1',
      input: [
        {
          role: 'user',
          content: [
            { type: 'input_text', text: prompt },
            { type: 'input_image', image_data: base64 },
          ],
        },
      ],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('❌ AI API error:', err);
    throw new Error('AI extraction failed');
  }

  const data = await response.json();
  const text = data.output_text?.trim() || '';

  try {
    const parsed = JSON.parse(text);
    console.log('✅ Extracted fields via AI:', parsed);
    return parsed;
  } catch (err) {
    console.error('⚠️ Failed to parse AI response:', text);
    return [];
  }

  async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  ====================== END FUTURE SECTION ======================
  */
}
