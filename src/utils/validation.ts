// src/utils/validation.ts
import { z } from 'zod';

/**
 * 🧩 Bounding box schema
 * Used for field position details on PDF (optional)
 */
export const BoundingBoxSchema = z.object({
  page: z.number(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});

/**
 * 🧩 Field options schema
 * Used for checkbox groups or dropdowns
 */
export const FieldOptionSchema = z.object({
  label: z.string().min(1, 'Option label cannot be empty'),
  value: z.boolean(),
});

/**
 * 🧩 Extracted field schema
 * Main structure returned by AI/OCR extractor
 */
export const ExtractedFieldSchema = z.object({
  id: z.string().min(1, 'Field ID is required'),
  label: z.string().min(1, 'Field label is required'),
  type: z.enum(['text', 'number', 'checkbox', 'checkbox-group', 'date']),
  value: z.union([z.string(), z.number(), z.boolean()]).optional(),
  options: z.array(FieldOptionSchema).optional(),
  bbox: BoundingBoxSchema.optional(),
  confidence: z.number().min(0).max(1).optional(),
});

/**
 * 🧩 List of fields schema
 */
export const ExtractedFieldListSchema = z.array(ExtractedFieldSchema);

/**
 * 🧩 Optional: Entire extraction result schema (for future AI responses)
 */
export const PDFExtractionResponseSchema = z.object({
  fileName: z.string(),
  fields: ExtractedFieldListSchema,
  extractedAt: z.string().optional(),
});

/**
 * 🧠 Infer TypeScript types directly from Zod schema
 * (These will automatically match your Redux store)
 */
export type ExtractedField = z.infer<typeof ExtractedFieldSchema>;
export type ExtractedFieldList = z.infer<typeof ExtractedFieldListSchema>;
