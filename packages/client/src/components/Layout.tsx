import { Center, Flex } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { reset } from '../FrequencyList/frequencyListSlice';
import { useKeyboardShortcut } from '../hooks/keyboard';
import usePageHeight from '../hooks/usePageHeight';
import { useAppDispatch } from '../redux/hooks';
import SettingsModal from '../Settings';
import {
  open as openSettings,
  selectQuestionSettings,
} from '../Settings/settingsSlice';
import { ROUTES } from '../utils/routes';
import BonusHistoryModal from './BonusHistoryModal';
import { open as openBonusHistory } from './BonusHistoryModal/bonusHistoryModalSlice';
import Footer from './Footer';
import HamburgerMenu from './HamburgerMenu';
import Header from './Header';
import InfoModal from './InfoModal';
import { open as openInfo } from './InfoModal/infoModalSlice';
import TossupHistoryModal from './TossupHistoryModal';
import { open as openTossupHistory } from './TossupHistoryModal/tossupHistoryModalSlice';
import UpdatesModal from './UpdatesModal';

type Props = {
  children: React.ReactNode;
};

export default ({ children }: Props) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const questionSettings = useSelector(selectQuestionSettings);
  const pageHeight = usePageHeight();

  // if question settings change, reset freq to initial state
  useEffect(() => {
    dispatch(reset());
  }, [dispatch, questionSettings]);

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
      <SettingsModal />
      <UpdatesModal />
      <InfoModal />
      <HamburgerMenu />
      <TossupHistoryModal />
      <BonusHistoryModal />
      <Flex direction="column" h={pageHeight}>
        <Header />
        <Center flexDir="column" overflow="auto" flex={1} px={3}>
          {children}
        </Center>
        <Footer />
      </Flex>
    </>
  );
};
