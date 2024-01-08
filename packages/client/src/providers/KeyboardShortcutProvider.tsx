import useKeyboardShortcut from '../hooks/useKeyboardShortcut';
import { ROUTES } from '../routes';
import { useModalContext } from './ModalContext';

type Props = {
  children: JSX.Element;
};

export default function KeyboardShortcutProvider({ children }: Props) {
  const { openInfoModal, openSettingsModal, openUpdatesModal } =
    useModalContext();
  const { getURL: getTossupReaderURL } = ROUTES.tossupReader.useRouteContext();
  const { getURL: getBonusReaderURL } = ROUTES.bonusReader.useRouteContext();
  const { getURL: getFrequencyListURL } =
    ROUTES.frequencyList.useRouteContext();
  const { getURL: getClueSearchURL } = ROUTES.clueSearch.useRouteContext();
  const { getURL: getAboutURL } = ROUTES.about.useRouteContext();

  // open modal shortcuts
  useKeyboardShortcut('?', openInfoModal);
  useKeyboardShortcut('s', openSettingsModal);
  useKeyboardShortcut('u', openUpdatesModal);

  useKeyboardShortcut('1', getTossupReaderURL({}).go);
  useKeyboardShortcut('2', getBonusReaderURL({}).go);
  useKeyboardShortcut('3', getFrequencyListURL({}).go);
  useKeyboardShortcut('4', getClueSearchURL({}).go);
  useKeyboardShortcut('5', getAboutURL({}).go);

  return children;
}
