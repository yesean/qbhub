import { createContext, useContext } from 'react';

type ModalContextType = {
  closeModal: () => void;
  isModalOpen: boolean;
  openBonusHistoryModal: () => void;
  openHamburgerMenu: () => void;
  openInfoModal: () => void;
  openSettingsModal: () => void;
  openTossupHistoryModal: () => void;
  openUpdatesModal: () => void;
};

export const ModalContext = createContext<ModalContextType>({
  closeModal: () => {},
  isModalOpen: false,
  openBonusHistoryModal: () => {},
  openHamburgerMenu: () => {},
  openInfoModal: () => {},
  openSettingsModal: () => {},
  openTossupHistoryModal: () => {},
  openUpdatesModal: () => {},
});

export const useModalContext = () => useContext(ModalContext);
