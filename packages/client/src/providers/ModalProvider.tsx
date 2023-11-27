import { useCallback, useMemo, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import BonusHistoryModal from '../BonusHistoryModal';
import InfoModal from '../InfoModal';
import SettingsModal from '../SettingsModal';
import TossupHistoryModal from '../TossupHistoryModal';
import UpdatesModal from '../UpdatesModal';
import HamburgerMenu from '../components/HamburgerMenu';
import useKeyboardShortcut from '../hooks/useKeyboardShortcut';
import { ModalContext } from './ModalContext';

enum ModalVariant {
  SettingsModalVariant,
  UpdatesModalVariant,
  InfoModalVariant,
  TossupHistoryModalVariant,
  BonusHistoryModalVariant,
  HamburgerMenuVariant,
}

type ModalProviderProps = {
  children: JSX.Element;
};

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [activeModal, setActiveModal] = useState<ModalVariant | null>(null);

  const closeModal = useCallback(() => setActiveModal(null), []);

  // global esc to close modal shortcut
  useKeyboardShortcut('Escape', closeModal, {
    allowHTMLInput: true,
    allowWhenModalIsOpen: true,
  });

  const modalContext = useMemo(
    () => ({
      isModalOpen: activeModal != null,
      closeModal,
      openSettingsModal: () =>
        setActiveModal(ModalVariant.SettingsModalVariant),
      openUpdatesModal: () => setActiveModal(ModalVariant.UpdatesModalVariant),
      openInfoModal: () => setActiveModal(ModalVariant.InfoModalVariant),
      openTossupHistoryModal: () =>
        setActiveModal(ModalVariant.TossupHistoryModalVariant),
      openBonusHistoryModal: () =>
        setActiveModal(ModalVariant.BonusHistoryModalVariant),
      openHamburgerMenu: () =>
        setActiveModal(ModalVariant.HamburgerMenuVariant),
    }),
    [activeModal, closeModal],
  );

  return (
    <ModalContext.Provider value={modalContext}>
      <SettingsModal
        isOpen={activeModal === ModalVariant.SettingsModalVariant}
        closeModal={closeModal}
      />
      <UpdatesModal
        isOpen={activeModal === ModalVariant.UpdatesModalVariant}
        closeModal={closeModal}
      />
      <InfoModal
        isOpen={activeModal === ModalVariant.InfoModalVariant}
        closeModal={closeModal}
      />
      <TossupHistoryModal
        isOpen={activeModal === ModalVariant.TossupHistoryModalVariant}
        closeModal={closeModal}
      />
      <BonusHistoryModal
        isOpen={activeModal === ModalVariant.BonusHistoryModalVariant}
        closeModal={closeModal}
      />
      <HamburgerMenu
        isOpen={activeModal === ModalVariant.HamburgerMenuVariant}
        closeModal={closeModal}
      />
      <Toaster position="bottom-center" />
      {children}
    </ModalContext.Provider>
  );
};
