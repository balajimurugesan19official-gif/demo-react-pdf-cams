// src/utils/aiExtractor.ts
// Uses OpenAI GPT-4.1-Vision to automatically detect form fields and values from uploaded PDFs.

export interface ExtractedField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'checkbox' | 'date';
  value: string | number | boolean;
}

/**
 * Reads a scanned or fillable PDF form and returns structured field data using OpenAI GPT-4.1-Vision.
 */
export async function extractFieldsFromPDF(
  file: File
): Promise<ExtractedField[]> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey)
    throw new Error('Missing OpenAI API key in .env (VITE_OPENAI_API_KEY)');

  console.log('📄 Uploading file for AI field detection:', file.name);

  const base64 = await fileToBase64(file);

  // 🧠 This is what GPT-4.1 sees and is instructed to do
  const prompt = `
You are an expert document AI. Analyze the uploaded PDF form and extract all form fields and their values.
Return a JSON array where each object includes:
- "id": a snake_case identifier (based on label)
- "label": the field name or label visible on the form
- "type": one of ["text", "number", "date", "checkbox"]
- "value": the detected value (string, number, boolean)

⚠️ Rules:
- Return only valid JSON (no explanations).
- If the value is empty, set it to "".
- Detect dates and output in ISO (YYYY-MM-DD) format if possible.
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
    console.error('❌ OpenAI error:', err);
    throw new Error('Failed to analyze PDF');
  }

  const data = await response.json();
  const text = data.output_text?.trim() || '';

  try {
    const parsed = JSON.parse(text);
    console.log('✅ Extracted fields:', parsed);
    return parsed;
  } catch (e) {
    console.error('⚠️ Could not parse AI output:', text);
    return [];
  }
}

/** Convert File to base64 for image/PDF upload */
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
