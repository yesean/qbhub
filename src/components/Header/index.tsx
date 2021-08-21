import { SettingsIcon } from '@chakra-ui/icons';
import { Box, Flex, Heading, IconButton } from '@chakra-ui/react';

const Header: React.FC = () => {
  return (
    <Box bg="gray.100" pr={2}>
      <Flex justify="space-between" align="center">
        <Heading d="inline" p={2}>
          qbc
        </Heading>
        <IconButton
          aria-label="Open settings"
          icon={<SettingsIcon boxSize={6} />}
          size="lg"
        />
      </Flex>
    </Box>
  );
};

export default Header;
