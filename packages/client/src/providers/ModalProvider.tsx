import BonusHistoryModal from '../BonusHistoryModal';
import HamburgerMenu from '../components/HamburgerMenu';
import InfoModal from '../InfoModal';
import SettingsModal from '../SettingsModal';
import TossupHistoryModal from '../TossupHistoryModal';
import UpdatesModal from '../UpdatesModal';

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
