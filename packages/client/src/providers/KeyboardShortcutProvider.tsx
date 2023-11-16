import { useNavigate } from 'react-router-dom';
import { open as openInfo } from '../components/InfoModal/infoModalSlice';
import { useKeyboardShortcut } from '../hooks/keyboard';
import { useAppDispatch } from '../redux/hooks';
import { open as openSettings } from '../SettingsModal/settingsSlice';
import { useGetURL } from '../utils/routes';

type Props = {
  children: JSX.Element;
};

export default ({ children }: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    getTossupReaderURL,
    getBonusReaderURL,
    getFrequencyListURL,
    getClueSearchURL,
    getAboutURL,
  } = useGetURL();

  // add global keyboard shortcuts
  const predicate = (e: KeyboardEvent) => e.target === document.body;
  useKeyboardShortcut('?', () => dispatch(openInfo()), predicate);
  useKeyboardShortcut('s', () => dispatch(openSettings()), predicate);
  useKeyboardShortcut('1', () => navigate(getTossupReaderURL()), predicate);
  useKeyboardShortcut('2', () => navigate(getBonusReaderURL()), predicate);
  useKeyboardShortcut('3', () => navigate(getFrequencyListURL()), predicate);
  useKeyboardShortcut('4', () => navigate(getClueSearchURL()), predicate);
  useKeyboardShortcut('5', () => navigate(getAboutURL()), predicate);

  return children;
};
