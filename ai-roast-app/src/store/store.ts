import { configureStore } from '@reduxjs/toolkit';
import faceAnalysisReducer from './slices/faceAnalysisSlice';

export const store = configureStore({
    reducer: {
        faceAnalysis: faceAnalysisReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;