import { HamburgerIcon, SettingsIcon, TimeIcon } from '@chakra-ui/icons';
import { Box, Flex, Heading, IconButton } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { open as openSettings } from '../../Settings/settingsSlice';
import { ROUTES } from '../../utils/routes';
import { open as openHamburgerMenu } from '../HamburgerMenu/hamburgerMenuSlice';
import { open as openHistory } from '../TossupHistoryModal/tossupHistoryModalSlice';

const Header: React.FC<React.PropsWithChildren<unknown>> = () => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  const openHistoryModal = () => dispatch(openHistory());
  const openSettingsModal = () => dispatch(openSettings());
  const openMenu = () => dispatch(openHamburgerMenu());

  const renderTossupHistory = () => {
    if (!pathname.startsWith(ROUTES.reader.tossup)) return null;

    return (
      <IconButton
        aria-label="Tossup history"
        icon={<TimeIcon boxSize={6} />}
        size="lg"
        onClick={openHistoryModal}
        mr={4}
      />
    );
  };

  return (
    <Box p={3}>
      <Flex justify="space-between" align="center">
        <Heading display="inline">QBHub</Heading>
        <Box>
          {renderTossupHistory()}
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
