import { useCallback, useMemo, useState } from 'react';
import { Flex } from '@chakra-ui/react';

import Header from './components/Header';
import Body from './components/Body';
import SettingsModal from './components/SettingsModal';
import { Category, Difficulty, Tossup } from './types';
import { fetchTossup } from './services/tossupService';
import {
  blankTossup,
  defaultCategories,
  defaultDifficulties,
} from './constants';
import { TossupContext, TossupContextType } from './services/TossupContext';

const App: React.FC = () => {
  const [tossup, setTossup] = useState<Tossup>(blankTossup);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [categoriesSelected, setCategoriesSelected] = useState<Category[]>(
    defaultCategories
  );
  const [difficultiesSelected, setDifficultiesSelected] = useState<
    Difficulty[]
  >(defaultDifficulties);

  const refreshTossup = useCallback(async () => {
    setTossup(blankTossup);
    const tu = await fetchTossup(categoriesSelected, difficultiesSelected);
    setTossup(tu);
  }, [categoriesSelected, difficultiesSelected]);

  const tossupContext = useMemo<TossupContextType>(
    () => ({ tossup, refreshTossup }),
    [tossup, refreshTossup]
  );

  return (
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
  );
};

export default App;
