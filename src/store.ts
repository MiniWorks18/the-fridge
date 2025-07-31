import { configureStore } from "@reduxjs/toolkit";
import fridgeReducer from './slices/fridgeSlice';

export const store = configureStore({
    reducer: {
        fridge: fridgeReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;