import { useNavigate } from 'react-router-dom';
import { useKeyboardShortcut } from '../hooks/keyboard';
import { useGetURL } from '../utils/routes';
import { useModalContext } from './ModalContext';

type Props = {
  children: JSX.Element;
};

export default ({ children }: Props) => {
  const navigate = useNavigate();
  const { openInfoModal, openSettingsModal } = useModalContext();
  const {
    getTossupReaderURL,
    getBonusReaderURL,
    getFrequencyListURL,
    getClueSearchURL,
    getAboutURL,
  } = useGetURL();

  // add global keyboard shortcuts
  const predicate = (e: KeyboardEvent) => e.target === document.body;
  useKeyboardShortcut('?', openInfoModal, predicate);
  useKeyboardShortcut('s', openSettingsModal, predicate);
  useKeyboardShortcut('1', () => navigate(getTossupReaderURL()), predicate);
  useKeyboardShortcut('2', () => navigate(getBonusReaderURL()), predicate);
  useKeyboardShortcut('3', () => navigate(getFrequencyListURL()), predicate);
  useKeyboardShortcut('4', () => navigate(getClueSearchURL()), predicate);
  useKeyboardShortcut('5', () => navigate(getAboutURL()), predicate);

  return children;
};
