import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { open as openBonusHistory } from '../components/BonusHistoryModal/bonusHistoryModalSlice';
import { open as openInfo } from '../components/InfoModal/infoModalSlice';
import { open as openTossupHistory } from '../components/TossupHistoryModal/tossupHistoryModalSlice';
import { reset } from '../FrequencyList/frequencyListSlice';
import { useKeyboardShortcut } from '../hooks/keyboard';
import { useAppDispatch } from '../redux/hooks';
import {
  open as openSettings,
  selectQuestionSettings,
} from '../Settings/settingsSlice';
import { ROUTES } from '../utils/routes';

type Props = {
  children: JSX.Element;
};

export default ({ children }: Props) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const questionSettings = useSelector(selectQuestionSettings);

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

  return children;
};
