import { createContext, useContext } from 'react';

type ModalContextType = {
  isModalOpen: boolean;
  closeModal: () => void;
  openSettingsModal: () => void;
  openUpdatesModal: () => void;
  openInfoModal: () => void;
  openTossupHistoryModal: () => void;
  openBonusHistoryModal: () => void;
  openHamburgerMenu: () => void;
};

export const ModalContext = createContext<ModalContextType>({
  isModalOpen: false,
  closeModal: () => {},
  openSettingsModal: () => {},
  openUpdatesModal: () => {},
  openInfoModal: () => {},
  openTossupHistoryModal: () => {},
  openBonusHistoryModal: () => {},
  openHamburgerMenu: () => {},
});

export const useModalContext = () => useContext(ModalContext);
