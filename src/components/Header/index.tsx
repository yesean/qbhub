import { HamburgerIcon, SettingsIcon, TimeIcon } from '@chakra-ui/icons';
import { Box, Flex, Heading, IconButton } from '@chakra-ui/react';

type HeaderProps = {
  onClickHistoryIcon: () => void;
  onClickSettingsIcon: () => void;
  onClickMenuIcon: () => void;
};

const Header: React.FC<HeaderProps> = ({
  onClickHistoryIcon,
  onClickSettingsIcon,
  onClickMenuIcon,
}) => {
  return (
    <Box pl={4} pr={4} mb={2}>
      <Flex justify="space-between" align="center">
        <Heading d="inline" p={2}>
          QBHub
        </Heading>
        <Box>
          <IconButton
            aria-label="Tossup history"
            icon={<TimeIcon boxSize={6} />}
            size="lg"
            onClick={onClickHistoryIcon}
            mr={4}
          />
          <IconButton
            aria-label="Open settings"
            icon={<SettingsIcon boxSize={6} />}
            size="lg"
            onClick={onClickSettingsIcon}
            mr={4}
          />
          <IconButton
            aria-label="Open menu"
            icon={<HamburgerIcon boxSize={6} />}
            size="lg"
            onClick={onClickMenuIcon}
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default Header;
