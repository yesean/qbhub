import { createContext } from 'react';

export enum Mode {
  start = 1,
  fetchingTossup,
  reading,
  answering,
  revealed,
}

export type ModeContextType = {
  mode: Mode;
  setMode: (m: Mode) => void;
};

export const ModeContext = createContext<ModeContextType>({
  mode: Mode.start,
  setMode: () => {},
});
