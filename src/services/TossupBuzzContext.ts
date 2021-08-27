import { createContext } from 'react';
import { TossupBuzz } from '../types';

export type TossupBuzzContextType = {
  buzz: TossupBuzz | null;
  setBuzz: React.Dispatch<React.SetStateAction<TossupBuzz | null>>;
};

export const TossupBuzzContext = createContext<TossupBuzzContextType>({
  buzz: null,
  setBuzz: () => {},
});
