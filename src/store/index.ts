import { configureStore } from '@reduxjs/toolkit';

import { tourSearchSlice } from './slices/tourSearchSlice';

export const store = configureStore({
  reducer: {
    tourSearch: tourSearchSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
