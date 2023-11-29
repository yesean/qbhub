import { configureStore } from '@reduxjs/toolkit';
import bonusReaderReducer from '../BonusReader/bonusReaderSlice';
import cluesGeneatorReducer from '../CluesGenerator/cluesGeneratorSlice';
import frequencyListReducer from '../FrequencyList/frequencyListSlice';
import tossupReaderReducer from '../TossupReader/tossupReaderSlice';

export const store = configureStore({
  reducer: {
    bonusReader: bonusReaderReducer,
    cluesGenerator: cluesGeneatorReducer,
    frequencyList: frequencyListReducer,
    tossupReader: tossupReaderReducer,
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

export type Subscription<T> = Parameters<typeof observeStore<T>>;
