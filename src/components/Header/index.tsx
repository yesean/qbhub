import { HamburgerIcon, SettingsIcon, TimeIcon } from '@chakra-ui/icons';
import { Box, Flex, Heading, IconButton } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { open as openSettings } from '../../Settings/settingsSlice';
import { ROUTES } from '../../utils/routes';
import { open as openHamburgerMenu } from '../HamburgerMenu/hamburgerMenuSlice';
import { open as openHistory } from '../TossupHistoryModal/tossupHistoryModalSlice';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  const openHistoryModal = () => dispatch(openHistory());
  const openSettingsModal = () => dispatch(openSettings());
  const openMenu = () => dispatch(openHamburgerMenu());

  // only render history icon on reader pages
  const renderHistory = () => {
    if (pathname.startsWith(ROUTES.reader.root)) {
      return (
        <IconButton
          aria-label="Tossup history"
          icon={<TimeIcon boxSize={6} />}
          size="lg"
          onClick={openHistoryModal}
          mr={4}
        />
      );
    }
    return null;
  };

  return (
    <Box p={3} mb={2}>
      <Flex justify="space-between" align="center">
        <Heading d="inline">QBHub</Heading>
        <Box>
          {renderHistory()}
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
            onClick={openMenu}
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default Header;
