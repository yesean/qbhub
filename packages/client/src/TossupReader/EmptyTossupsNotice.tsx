import { RepeatIcon } from '@chakra-ui/icons';
import { Container, Flex, IconButton, Text } from '@chakra-ui/react';

import useActions from '../hooks/useActions';

export default function EmptyTossupsNotice() {
  const { dispatchNextTossup } = useActions();

  return (
    <Flex align="center" direction="column" gap={4}>
      <Container bg="gray.100" borderRadius="md" p={4}>
        <Text>No tossups found, try adjusting your question settings.</Text>
      </Container>
      <IconButton
        aria-label="Refetch tossups"
        icon={<RepeatIcon />}
        onClick={dispatchNextTossup}
      />
    </Flex>
  );
}
