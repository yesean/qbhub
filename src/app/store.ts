import { configureStore } from '@reduxjs/toolkit';
import bonusReaderReducer from '../BonusReader/bonusReaderSlice';
import cluesGeneatorReducer from '../CluesGenerator/cluesGeneratorSlice';
import bonusHistoryModalReducer from '../components/BonusHistoryModal/bonusHistoryModalSlice';
import hamburgerMenuReducer from '../components/HamburgerMenu/hamburgerMenuSlice';
import infoModalReducer from '../components/InfoModal/infoModalSlice';
import tossupHistoryModalReducer from '../components/TossupHistoryModal/tossupHistoryModalSlice';
import frequencyListReducer from '../FrequencyList/frequencyListSlice';
import settingsReducer, {
  categoriesSubscription,
  difficultiesSubscription,
  fromYearSubscription,
  readingSpeedSubscription,
  subcategoriesSubscription,
  tournamentsSubscription
} from '../Settings/settingsSlice';
import tossupReaderReducer from '../TossupReader/tossupReaderSlice';

export const store = configureStore({
  reducer: {
    tossupReader: tossupReaderReducer,
    bonusReader: bonusReaderReducer,
    settings: settingsReducer,
    frequencyList: frequencyListReducer,
    cluesGenerator: cluesGeneatorReducer,
    infoModal: infoModalReducer,
    tossupHistoryModal: tossupHistoryModalReducer,
    bonusHistoryModal: bonusHistoryModalReducer,
    hamburgerMenu: hamburgerMenuReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const observeStore = <T>(
  selector: (state: RootState) => T,
  onChange: (state: T, dispatch: AppDispatch) => void,
) => {
  let currentState: T;

  const handleChange = () => {
    const nextState = selector(store.getState());
    if (nextState !== currentState) {
      currentState = nextState;
      onChange(currentState, store.dispatch);
    }
  };

  const unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Subscription<T> = Parameters<typeof observeStore<T>>;

observeStore(...readingSpeedSubscription)
observeStore(...categoriesSubscription)
observeStore(...subcategoriesSubscription)
observeStore(...difficultiesSubscription)
observeStore(...tournamentsSubscription)
observeStore(...fromYearSubscription)
