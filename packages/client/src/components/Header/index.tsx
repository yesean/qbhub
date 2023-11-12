import { HamburgerIcon, SettingsIcon, TimeIcon } from '@chakra-ui/icons';
import { Box, Flex, Heading, IconButton } from '@chakra-ui/react';
import { useAppDispatch } from '../../redux/hooks';
import { open as openSettings } from '../../Settings/settingsSlice';
import { usePage } from '../../utils/routes';
import { open as openBonusHistory } from '../BonusHistoryModal/bonusHistoryModalSlice';
import { open as openHamburgerMenu } from '../HamburgerMenu/hamburgerMenuSlice';
import { open as openTossupHistory } from '../TossupHistoryModal/tossupHistoryModalSlice';

const Header: React.FC<React.PropsWithChildren<unknown>> = () => {
  const dispatch = useAppDispatch();
  const page = usePage();

  const openTossupHistoryModal = () => dispatch(openTossupHistory());
  const openBonusHistoryModal = () => dispatch(openBonusHistory());
  const openSettingsModal = () => dispatch(openSettings());
  const openMenu = () => dispatch(openHamburgerMenu());

  // only render history icon on reader pages
  const renderQuestionHistory = () => {
    if (!page.isReader) return null;

    return (
      <IconButton
        aria-label="Tossup history"
        icon={<TimeIcon boxSize={6} />}
        size="lg"
        onClick={
          page.isTossupReader ? openTossupHistoryModal : openBonusHistoryModal
        }
        mr={4}
      />
    );
  };

  return (
    <Box p={3}>
      <Flex justify="space-between" align="center">
        <Heading display="inline">QBHub</Heading>
        <Box>
          {renderQuestionHistory()}
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
