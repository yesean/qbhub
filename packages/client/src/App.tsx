import { Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Body from './components/Body';
import BonusHistoryModal from './components/BonusHistoryModal';
import { open as openBonusHistory } from './components/BonusHistoryModal/bonusHistoryModalSlice';
import Footer from './components/Footer';
import HamburgerMenu from './components/HamburgerMenu';
import Header from './components/Header';
import InfoModal from './components/InfoModal';
import { open as openInfo } from './components/InfoModal/infoModalSlice';
import TossupHistoryModal from './components/TossupHistoryModal';
import { open as openTossupHistory } from './components/TossupHistoryModal/tossupHistoryModalSlice';
import UpdatesModal from './components/UpdatesModal';
import { reset } from './FrequencyList/frequencyListSlice';
import { useKeyboardShortcut } from './hooks/keyboard';
import { useAppDispatch } from './redux/hooks';
import SettingsModal from './Settings';
import {
  open as openSettings,
  selectQuestionSettings,
} from './Settings/settingsSlice';
import { ROUTES } from './utils/routes';

const App: React.FC<React.PropsWithChildren<unknown>> = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const questionSettings = useSelector(selectQuestionSettings);
  const [pageHeight, setPageHeight] = useState(window.innerHeight);

  // if question settings change, reset freq to initial state
  useEffect(() => {
    dispatch(reset());
  }, [dispatch, questionSettings]);

  useEffect(() => {
    const resize = () => {
      setPageHeight(window.innerHeight);
    };
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  // add global keyboard shortcuts
  const predicate = (e: KeyboardEvent) => e.target === document.body;
  useKeyboardShortcut('?', () => dispatch(openInfo()), predicate);
  useKeyboardShortcut('s', () => dispatch(openSettings()), predicate);
  useKeyboardShortcut('1', () => navigate(ROUTES.reader.tossup), predicate);
  useKeyboardShortcut('2', () => navigate(ROUTES.reader.bonus), predicate);
  useKeyboardShortcut('3', () => navigate(ROUTES.freq.root), predicate);
  useKeyboardShortcut('4', () => navigate(ROUTES.clues.search), predicate);
  useKeyboardShortcut('5', () => navigate(ROUTES.about.root), predicate);
  const isReaderActive = pathname.startsWith(ROUTES.reader.root);
  const isTossupReaderActive = pathname.startsWith(ROUTES.reader.tossup);
  const customPredicate = (e: KeyboardEvent) => predicate(e) && isReaderActive;
  useKeyboardShortcut(
    'h',
    () =>
      isTossupReaderActive
        ? dispatch(openTossupHistory())
        : dispatch(openBonusHistory()),
    customPredicate,
  );

  return (
    <>
      <Flex direction="column" h={pageHeight}>
        <Header />
        <Body />
        <Footer />
      </Flex>
      <SettingsModal />
      <UpdatesModal />
      <InfoModal />
      <HamburgerMenu />
      <TossupHistoryModal />
      <BonusHistoryModal />
    </>
  );
};

export default App;
