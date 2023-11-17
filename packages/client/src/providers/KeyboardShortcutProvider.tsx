import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useKeyboardShortcut from '../hooks/useKeyboardShortcut';
import { useGetURL } from '../utils/routes';
import { useModalContext } from './ModalContext';

type Props = {
  children: JSX.Element;
};

export default ({ children }: Props) => {
  const navigate = useNavigate();
  const { openInfoModal, openSettingsModal, openUpdatesModal } =
    useModalContext();
  const {
    getTossupReaderURL,
    getBonusReaderURL,
    getFrequencyListURL,
    getClueSearchURL,
    getAboutURL,
  } = useGetURL();

  // open modal shortcuts
  useKeyboardShortcut('?', openInfoModal);
  useKeyboardShortcut('s', openSettingsModal);
  useKeyboardShortcut('u', openUpdatesModal);

  // switch pages shortcuts
  const goToTossupReader = useCallback(
    () => navigate(getTossupReaderURL()),
    [getTossupReaderURL, navigate],
  );
  const goToBonusReader = useCallback(
    () => navigate(getBonusReaderURL()),
    [getBonusReaderURL, navigate],
  );
  const goToFrequencyList = useCallback(
    () => navigate(getFrequencyListURL()),
    [getFrequencyListURL, navigate],
  );
  const goToClueSearch = useCallback(
    () => navigate(getClueSearchURL()),
    [getClueSearchURL, navigate],
  );
  const goToAbout = useCallback(
    () => navigate(getAboutURL()),
    [getAboutURL, navigate],
  );
  useKeyboardShortcut('1', goToTossupReader);
  useKeyboardShortcut('2', goToBonusReader);
  useKeyboardShortcut('3', goToFrequencyList);
  useKeyboardShortcut('4', goToClueSearch);
  useKeyboardShortcut('5', goToAbout);

  return children;
};
