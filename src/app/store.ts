import { configureStore } from '@reduxjs/toolkit';
import frequencyListReducer from '../FrequencyList/frequencyListSlice';
import settingsReducer from '../Settings/settingsSlice';
import tossupReaderReducer from '../TossupReader/tossupReaderSlice';

export const store = configureStore({
  reducer: {
    tossupReader: tossupReaderReducer,
    settings: settingsReducer,
    frequencyList: frequencyListReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
