import { useCallback, useMemo, useState } from 'react';
import { Flex } from '@chakra-ui/react';

import Header from './components/Header';
import Body from './components/Body';
import SettingsModal from './components/SettingsModal';
import TossupHistoryModal from './components/TossupHistoryModal';
import {
  Category,
  Difficulty,
  Subcategory,
  Tossup,
  TossupResult,
} from './types';
import { fetchTossup } from './services/tossupService';
import {
  blankTossup,
  getInitialCategories,
  getInitialDifficulties,
  getInitialSubcategories,
} from './constants';
import { Mode, ModeContext, ModeContextType } from './services/ModeContext';
import { TossupContext, TossupContextType } from './services/TossupContext';
import { TossupResultContext } from './services/TossupResultContext';
import logger from './services/logger';
import { cleanTossupText } from './services/utils';

const App: React.FC = () => {
  const [mode, setMode] = useState<Mode>(Mode.start);
  const [tossup, setTossup] = useState<Tossup>(blankTossup);
  const [tossupResult, setTossupResult] = useState<TossupResult | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isTossupHistoryModalOpen, setIsTossupHistoryModalOpen] =
    useState(false);
  const [categoriesSelected, setCategoriesSelected] = useState<Category[]>(
    getInitialCategories()
  );
  const [subcategoriesSelected, setSubcategoriesSelected] = useState<
    Subcategory[]
  >(getInitialSubcategories());
  const [difficultiesSelected, setDifficultiesSelected] = useState<
    Difficulty[]
  >(getInitialDifficulties());

  const refreshTossup = useCallback(async () => {
    setMode(Mode.fetchingTossup);
    setTossup(blankTossup);
    const tu = await fetchTossup(
      categoriesSelected,
      subcategoriesSelected,
      difficultiesSelected
    );
    logger.info(tu);
    const cleanedTu = {
      ...tu,
      text: cleanTossupText(tu.text),
      formattedText: cleanTossupText(tu.formattedText),
    };
    setTossup(cleanedTu);
    setMode(Mode.reading);
  }, [categoriesSelected, subcategoriesSelected, difficultiesSelected]);

  const setModeContext = useCallback((m: Mode) => {
    setMode(m);
  }, []);

  const modeContext = useMemo<ModeContextType>(
    () => ({ mode, setMode: setModeContext }),
    [mode, setModeContext]
  );

  const tossupContext = useMemo<TossupContextType>(
    () => ({ tossup, refreshTossup }),
    [tossup, refreshTossup]
  );

  const tossupResultContext = useMemo(
    () => ({
      result: tossupResult,
      setResult: setTossupResult,
    }),
    [tossupResult]
  );

  return (
    <ModeContext.Provider value={modeContext}>
      <TossupContext.Provider value={tossupContext}>
        <TossupResultContext.Provider value={tossupResultContext}>
          <Flex direction="column" h="100vh">
            <Header
              onClickHistoryIcon={() => setIsTossupHistoryModalOpen(true)}
              onClickSettingsIcon={() => setIsSettingsModalOpen(true)}
            />
            <Body />
          </Flex>
          <TossupHistoryModal
            isOpen={isTossupHistoryModalOpen}
            onClose={() => setIsTossupHistoryModalOpen(false)}
          />
          <SettingsModal
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
            categoriesSelected={categoriesSelected}
            setCategoriesSelected={setCategoriesSelected}
            subcategoriesSelected={subcategoriesSelected}
            setSubcategoriesSelected={setSubcategoriesSelected}
            difficultiesSelected={difficultiesSelected}
            setDifficultiesSelected={setDifficultiesSelected}
          />
        </TossupResultContext.Provider>
      </TossupContext.Provider>
    </ModeContext.Provider>
  );
};

export default App;
