import { configureStore } from '@reduxjs/toolkit';
import cluesGeneatorReducer from '../CluesGenerator/cluesGeneratorSlice';
import infoModalReducer from '../components/InfoModal/infoModalSlice';
import hamburgerMenuReducer from '../components/HamburgerMenu/hamburgerMenuSlice';
import tossupHistoryModalReducer from '../components/TossupHistoryModal/tossupHistoryModalSlice';
import frequencyListReducer from '../FrequencyList/frequencyListSlice';
import settingsReducer from '../Settings/settingsSlice';
import tossupReaderReducer from '../TossupReader/tossupReaderSlice';

export const store = configureStore({
  reducer: {
    tossupReader: tossupReaderReducer,
    settings: settingsReducer,
    frequencyList: frequencyListReducer,
    cluesGenerator: cluesGeneatorReducer,
    infoModal: infoModalReducer,
    tossupHistoryModal: tossupHistoryModalReducer,
    hamburgerMenu: hamburgerMenuReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
