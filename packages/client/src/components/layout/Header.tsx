import { HamburgerIcon, SettingsIcon, TimeIcon } from '@chakra-ui/icons';
import { Box, Flex, Heading, IconButton } from '@chakra-ui/react';
import { useModalContext } from '../../providers/ModalContext';
import { ROUTES } from '../../routes';

const Header: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { isPage: isTossupReader } = ROUTES.tossupReader.useRouteContext();
  const { isPage: isBonusReader } = ROUTES.bonusReader.useRouteContext();
  const isReader = isTossupReader || isBonusReader;

  const {
    openBonusHistoryModal,
    openHamburgerMenu,
    openSettingsModal,
    openTossupHistoryModal,
  } = useModalContext();

  const openHistoryModal = isTossupReader
    ? openTossupHistoryModal
    : openBonusHistoryModal;

  // only render history icon on reader pages
  const questionHistoryButton = isReader ? (
    <IconButton
      aria-label="Tossup history"
      icon={<TimeIcon boxSize={6} />}
      mr={4}
      onClick={openHistoryModal}
      size="lg"
    />
  ) : null;

  return (
    <Box p={3}>
      <Flex align="center" justify="space-between">
        <Heading display="inline">QBHub</Heading>
        <Box>
          {questionHistoryButton}
          <IconButton
            aria-label="Open settings"
            icon={<SettingsIcon boxSize={6} />}
            mr={4}
            onClick={openSettingsModal}
            size="lg"
          />
          <IconButton
            aria-label="Open menu"
            icon={<HamburgerIcon boxSize={6} />}
            onClick={openHamburgerMenu}
            size="lg"
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default Header;
