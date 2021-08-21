import { SettingsIcon } from '@chakra-ui/icons';
import { Box, Flex, Heading, IconButton } from '@chakra-ui/react';

type HeaderProps = {
  onClickSettingsIcon: () => void;
};

const Header: React.FC<HeaderProps> = ({ onClickSettingsIcon }) => {
  return (
    <Box bg="gray.100" pr={2}>
      <Flex justify="space-between" align="center">
        <Heading d="inline" p={2}>
          QBHub
        </Heading>
        <IconButton
          aria-label="Open settings"
          icon={<SettingsIcon boxSize={6} />}
          size="lg"
          onClick={onClickSettingsIcon}
        />
      </Flex>
    </Box>
  );
};

export default Header;
