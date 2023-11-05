import { Center, Flex } from '@chakra-ui/react';
import usePageHeight from '../hooks/usePageHeight';
import SettingsModal from '../Settings';
import BonusHistoryModal from './BonusHistoryModal';
import Footer from './Footer';
import HamburgerMenu from './HamburgerMenu';
import Header from './Header';
import InfoModal from './InfoModal';
import TossupHistoryModal from './TossupHistoryModal';
import UpdatesModal from './UpdatesModal';

type Props = {
  children: React.ReactNode;
};

export default ({ children }: Props) => {
  const pageHeight = usePageHeight();

  return (
    <>
      <SettingsModal />
      <UpdatesModal />
      <InfoModal />
      <HamburgerMenu />
      <TossupHistoryModal />
      <BonusHistoryModal />
      <Flex direction="column" h={pageHeight}>
        <Header />
        <Center flexDir="column" overflow="auto" flex={1} px={3}>
          {children}
        </Center>
        <Footer />
      </Flex>
    </>
  );
};
