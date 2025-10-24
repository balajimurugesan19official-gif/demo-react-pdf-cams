// 🧠 UPDATED: Focus slice to track which field is active
import { createSlice } from "@reduxjs/toolkit";

const focusSlice = createSlice({
  name: "focus",
  initialState: { focusedField: null },
  reducers: {
    setFocusedField: (state, action) => {
      state.focusedField = action.payload;
    },
  },
});

export const { setFocusedField } = focusSlice.actions;
export default focusSlice.reducer;
