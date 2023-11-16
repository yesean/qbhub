import { useNavigate } from 'react-router-dom';
import useKeyboardShortcut from '../hooks/useKeyboardShortcut';
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
  useKeyboardShortcut('?', openInfoModal);
  useKeyboardShortcut('s', openSettingsModal);
  useKeyboardShortcut('1', () => navigate(getTossupReaderURL()));
  useKeyboardShortcut('2', () => navigate(getBonusReaderURL()));
  useKeyboardShortcut('3', () => navigate(getFrequencyListURL()));
  useKeyboardShortcut('4', () => navigate(getClueSearchURL()));
  useKeyboardShortcut('5', () => navigate(getAboutURL()));

  return children;
};
