import { Flex } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Body from './components/Body';
import Footer from './components/Footer';
import HamburgerMenu from './components/HamburgerMenu';
import Header from './components/Header';
import SettingsModal from './components/SettingsModal';
import TossupHistoryModal from './components/TossupHistoryModal';
import { blankTossup } from './constants';
import logger from './services/logger';
import { Mode, ModeContext, ModeContextType } from './services/ModeContext';
import { TossupContext, TossupContextType } from './services/TossupContext';
import { TossupResultContext } from './services/TossupResultContext';
import { fetchTossup } from './services/tossupService';
import {
  TossupSettingsContext,
  TossupSettingsContextType,
} from './services/TossupSettingsContext';
import {
  cleanTossupText,
  getInitialCategories,
  getInitialDifficulties,
  getInitialReadingSpeed,
  getInitialSubcategories,
} from './services/utils';
import {
  Category,
  Difficulty,
  Subcategory,
  Tossup,
  TossupResult,
} from './types';

const NUM_TOSSUPS = 10;
const MIN_NUM_TOSSUPS = 5;

const App: React.FC = () => {
  const [mode, setMode] = useState<Mode>(Mode.start);
  const [activeTossup, setActiveTossup] = useState<Tossup>(blankTossup);
  const [tossups, setTossups] = useState<Tossup[]>([]);
  const [tossupResult, setTossupResult] = useState<TossupResult | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isTossupHistoryModalOpen, setIsTossupHistoryModalOpen] =
    useState(false);
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState(getInitialReadingSpeed());
  const [categoriesSelected, setCategoriesSelected] = useState<Category[]>(
    getInitialCategories(),
  );
  const [subcategoriesSelected, setSubcategoriesSelected] = useState<
    Subcategory[]
  >(getInitialSubcategories());
  const [difficultiesSelected, setDifficultiesSelected] = useState<
    Difficulty[]
  >(getInitialDifficulties());

  // update cached tossups on category change
  useEffect(() => {
    setTossups((tus) =>
      tus.filter((tu) => categoriesSelected.includes(tu.category)),
    );
  }, [categoriesSelected]);

  // update cached tossups on subcategory change
  useEffect(() => {
    setTossups((tus) =>
      tus.filter((tu) => subcategoriesSelected.includes(tu.subcategory)),
    );
  }, [subcategoriesSelected]);

  // update cached tossups on difficulty change
  useEffect(() => {
    setTossups((tus) =>
      tus.filter((tu) => difficultiesSelected.includes(tu.difficulty)),
    );
  }, [difficultiesSelected]);

  const fetchMoreTossups = useCallback(
    async (limit: number) => {
      const fetchedTus = await fetchTossup(
        categoriesSelected,
        subcategoriesSelected,
        difficultiesSelected,
        limit,
      );
      const cleanedTus = fetchedTus.map((tu) => ({
        ...tu,
        text: cleanTossupText(tu.text),
        formattedText: cleanTossupText(tu.formattedText),
      }));
      logger.info('cleaned tossups: ', cleanedTus);
      setTossups((tus) =>
        tus.length <= MIN_NUM_TOSSUPS ? [...tus, ...cleanedTus] : tus,
      );
    },
    [categoriesSelected, subcategoriesSelected, difficultiesSelected],
  );

  useEffect(() => {
    const getNextTossup = () => {
      if (mode === Mode.fetchingTossup) {
        logger.info('getting next tossup');
        logger.info('tossups: ', tossups);
        if (tossups.length === 0) {
          logger.info('no tossups :(');
          logger.info('fetching more tossups');
          return fetchMoreTossups(NUM_TOSSUPS);
        }
        if (tossups.length <= MIN_NUM_TOSSUPS) {
          logger.info('need to get more tossups');
          fetchMoreTossups(NUM_TOSSUPS - tossups.length);
        }

        const nextTossup = tossups.splice(0, 1)[0];
        logger.info('setting activeTossup to', nextTossup);
        setActiveTossup(nextTossup);
        setTossups([...tossups]);
        setMode(Mode.reading);
      }
      return () => {};
    };

    getNextTossup();
  }, [fetchMoreTossups, tossups, mode]);

  const modeContext = useMemo<ModeContextType>(
    () => ({ mode, setMode }),
    [mode],
  );

  const tossupSettingsContext = useMemo<TossupSettingsContextType>(
    () => ({
      readingSpeed,
      setReadingSpeed,
      categoriesSelected,
      setCategoriesSelected,
      subcategoriesSelected,
      setSubcategoriesSelected,
      difficultiesSelected,
      setDifficultiesSelected,
    }),
    [
      readingSpeed,
      categoriesSelected,
      setCategoriesSelected,
      subcategoriesSelected,
      setSubcategoriesSelected,
      difficultiesSelected,
      setDifficultiesSelected,
    ],
  );

  const tossupContext = useMemo<TossupContextType>(
    () => ({ tossup: activeTossup }),
    [activeTossup],
  );

  const tossupResultContext = useMemo(
    () => ({
      result: tossupResult,
      setResult: setTossupResult,
    }),
    [tossupResult],
  );

  return (
    <ModeContext.Provider value={modeContext}>
      <TossupSettingsContext.Provider value={tossupSettingsContext}>
        <TossupContext.Provider value={tossupContext}>
          <TossupResultContext.Provider value={tossupResultContext}>
            <Flex direction="column" h="100vh">
              <Header
                onClickHistoryIcon={() => setIsTossupHistoryModalOpen(true)}
                onClickSettingsIcon={() => setIsSettingsModalOpen(true)}
                onClickMenuIcon={() => setIsHamburgerMenuOpen(true)}
              />
              <Body />
              <Footer />
            </Flex>
            <TossupHistoryModal
              isOpen={isTossupHistoryModalOpen}
              onClose={() => setIsTossupHistoryModalOpen(false)}
            />
            <SettingsModal
              isOpen={isSettingsModalOpen}
              onClose={() => setIsSettingsModalOpen(false)}
            />
            <HamburgerMenu
              isOpen={isHamburgerMenuOpen}
              onClose={() => setIsHamburgerMenuOpen(false)}
            />
          </TossupResultContext.Provider>
        </TossupContext.Provider>
      </TossupSettingsContext.Provider>
    </ModeContext.Provider>
  );
};

export default App;
