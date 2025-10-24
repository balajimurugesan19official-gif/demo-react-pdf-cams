// src/store/formSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExtractedField } from '../utils/aiExtractor';

interface FormState {
  fields: ExtractedField[];
}

const initialState: FormState = {
  fields: [],
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setFields: (state, action: PayloadAction<ExtractedField[]>) => {
      state.fields = action.payload;
    },
    updateFieldValue: (
      state,
      action: PayloadAction<{ id: string; value: any }>
    ) => {
      const field = state.fields.find((f) => f.id === action.payload.id);
      if (field) field.value = action.payload.value;
    },
  },
});

export const { setFields, updateFieldValue } = formSlice.actions;
export default formSlice.reducer;
