import { SettingsIcon, TimeIcon } from '@chakra-ui/icons';
import { Box, Flex, Heading, IconButton } from '@chakra-ui/react';

type HeaderProps = {
  onClickSettingsIcon: () => void;
  onClickHistoryIcon: () => void;
};

const Header: React.FC<HeaderProps> = ({
  onClickSettingsIcon,
  onClickHistoryIcon,
}) => {
  return (
    <Box pl={4} pr={4}>
      <Flex justify="space-between" align="center">
        <Heading d="inline" p={2}>
          QBHub
        </Heading>
        <Box>
          <IconButton
            aria-label="Tossup history"
            icon={<TimeIcon boxSize={6} />}
            size="lg"
            bg="white"
            onClick={onClickHistoryIcon}
            mr={4}
          />
          <IconButton
            aria-label="Open settings"
            icon={<SettingsIcon boxSize={6} />}
            size="lg"
            onClick={onClickSettingsIcon}
            bg="white"
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default Header;
