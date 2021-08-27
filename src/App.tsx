import { useCallback, useMemo, useState } from 'react';
import { Flex } from '@chakra-ui/react';

import Header from './components/Header';
import Body from './components/Body';
import SettingsModal from './components/SettingsModal';
import { Category, Difficulty, Tossup } from './types';
import { fetchTossup } from './services/tossupService';
import {
  blankTossup,
  getInitialCategories,
  getInitialDifficulties,
} from './constants';
import { TossupContext, TossupContextType } from './services/TossupContext';
import { Mode, ModeContext, ModeContextType } from './services/ModeContext';
import logger from './services/logger';

const App: React.FC = () => {
  const [mode, setMode] = useState<Mode>(Mode.start);
  const [tossup, setTossup] = useState<Tossup>(blankTossup);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [categoriesSelected, setCategoriesSelected] = useState<Category[]>(
    getInitialCategories()
  );
  const [difficultiesSelected, setDifficultiesSelected] = useState<
    Difficulty[]
  >(getInitialDifficulties());

  const refreshTossup = useCallback(async () => {
    setMode(Mode.fetchingTossup);
    setTossup(blankTossup);
    const tu = await fetchTossup(categoriesSelected, difficultiesSelected);
    logger.info(tu);
    setTossup(tu);
    setMode(Mode.reading);
  }, [categoriesSelected, difficultiesSelected]);

  const tossupContext = useMemo<TossupContextType>(
    () => ({ tossup, refreshTossup }),
    [tossup, refreshTossup]
  );

  const setModeContext = useCallback((m: Mode) => {
    setMode(m);
  }, []);

  const modeContext = useMemo<ModeContextType>(
    () => ({ mode, setMode: setModeContext }),
    [mode, setModeContext]
  );

  return (
    <ModeContext.Provider value={modeContext}>
      <TossupContext.Provider value={tossupContext}>
        <Flex direction="column" h="100vh">
          <Header onClickSettingsIcon={() => setIsSettingsModalOpen(true)} />
          <Body />
        </Flex>
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          categoriesSelected={categoriesSelected}
          setCategoriesSelected={setCategoriesSelected}
          difficultiesSelected={difficultiesSelected}
          setDifficultiesSelected={setDifficultiesSelected}
        />
      </TossupContext.Provider>
    </ModeContext.Provider>
  );
};

export default App;
