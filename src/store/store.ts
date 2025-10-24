import { configureStore } from '@reduxjs/toolkit';
import formReducer from './formSlice';
import focusReducer from './focusSlice';

export const store = configureStore({
  reducer: {
    form: formReducer,
    focus: focusReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
