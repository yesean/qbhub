import { HamburgerIcon, SettingsIcon, TimeIcon } from '@chakra-ui/icons';
import { Box, Flex, Heading, IconButton } from '@chakra-ui/react';
import { useModalContext } from '../providers/ModalContext';
import { usePage } from '../utils/routes';

const Header: React.FC<React.PropsWithChildren<unknown>> = () => {
  const page = usePage();
  const {
    openTossupHistoryModal,
    openBonusHistoryModal,
    openSettingsModal,
    openHamburgerMenu,
  } = useModalContext();

  const openHistoryModal = page.isTossupReader
    ? openTossupHistoryModal
    : openBonusHistoryModal;

  // only render history icon on reader pages
  const questionHistoryButton = page.isReader ? (
    <IconButton
      aria-label="Tossup history"
      icon={<TimeIcon boxSize={6} />}
      size="lg"
      onClick={openHistoryModal}
      mr={4}
    />
  ) : null;

  return (
    <Box p={3}>
      <Flex justify="space-between" align="center">
        <Heading display="inline">QBHub</Heading>
        <Box>
          {questionHistoryButton}
          <IconButton
            aria-label="Open settings"
            icon={<SettingsIcon boxSize={6} />}
            size="lg"
            onClick={openSettingsModal}
            mr={4}
          />
          <IconButton
            aria-label="Open menu"
            icon={<HamburgerIcon boxSize={6} />}
            size="lg"
            onClick={openHamburgerMenu}
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default Header;