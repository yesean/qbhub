import { useCallback, useMemo, useState } from 'react';

import BonusHistoryModal from '../BonusHistoryModal';
import HamburgerMenu from '../components/routing/HamburgerMenu';
import useKeyboardShortcut from '../hooks/useKeyboardShortcut';
import InfoModal from '../InfoModal';
import SettingsModal from '../SettingsModal';
import TossupHistoryModal from '../TossupHistoryModal';
import UpdatesModal from '../UpdatesModal';
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
      closeModal,
      isModalOpen: activeModal != null,
      openBonusHistoryModal: () =>
        setActiveModal(ModalVariant.BonusHistoryModalVariant),
      openHamburgerMenu: () =>
        setActiveModal(ModalVariant.HamburgerMenuVariant),
      openInfoModal: () => setActiveModal(ModalVariant.InfoModalVariant),
      openSettingsModal: () =>
        setActiveModal(ModalVariant.SettingsModalVariant),
      openTossupHistoryModal: () =>
        setActiveModal(ModalVariant.TossupHistoryModalVariant),
      openUpdatesModal: () => setActiveModal(ModalVariant.UpdatesModalVariant),
    }),
    [activeModal, closeModal],
  );

  return (
    <ModalContext.Provider value={modalContext}>
      <SettingsModal
        closeModal={closeModal}
        isOpen={activeModal === ModalVariant.SettingsModalVariant}
      />
      <UpdatesModal
        closeModal={closeModal}
        isOpen={activeModal === ModalVariant.UpdatesModalVariant}
      />
      <InfoModal
        closeModal={closeModal}
        isOpen={activeModal === ModalVariant.InfoModalVariant}
      />
      <TossupHistoryModal
        closeModal={closeModal}
        isOpen={activeModal === ModalVariant.TossupHistoryModalVariant}
      />
      <BonusHistoryModal
        closeModal={closeModal}
        isOpen={activeModal === ModalVariant.BonusHistoryModalVariant}
      />
      <HamburgerMenu
        closeModal={closeModal}
        isOpen={activeModal === ModalVariant.HamburgerMenuVariant}
      />
      {children}
    </ModalContext.Provider>
  );
};
