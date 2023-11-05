import BonusHistoryModal from '../components/BonusHistoryModal';
import HamburgerMenu from '../components/HamburgerMenu';
import InfoModal from '../components/InfoModal';
import TossupHistoryModal from '../components/TossupHistoryModal';
import UpdatesModal from '../components/UpdatesModal';
import SettingsModal from '../Settings';

type Props = {
  children: JSX.Element;
};

export default ({ children }: Props) => (
  <>
    <SettingsModal />
    <UpdatesModal />
    <InfoModal />
    <HamburgerMenu />
    <TossupHistoryModal />
    <BonusHistoryModal />
    {children}
  </>
);
