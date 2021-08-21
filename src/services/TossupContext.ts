import { createContext } from 'react';
import { blankTossup } from '../constants';
import { Tossup } from '../types';

export type TossupContextType = {
  tossup: Tossup;
  refreshTossup: () => void;
};

export const TossupContext = createContext<TossupContextType>({
  tossup: blankTossup,
  refreshTossup: () => {},
});
