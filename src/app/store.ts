import { configureStore } from '@reduxjs/toolkit';
import tossupReaderReducer from '../TossupReader/tossupReaderSlice';
import settingsReducer from '../Settings/settingsSlice';
import frequencyListReducer from '../FrequencyList/frequencyListSlice';

export const store = configureStore({
  reducer: {
    tossupReader: tossupReaderReducer,
    settings: settingsReducer,
    frequencyList: frequencyListReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
