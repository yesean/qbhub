import { Box, Text } from '@chakra-ui/react';

type UserAnswerProps = {
  text: string;
  isCorrect: boolean;
};

const UserAnswer: React.FC<React.PropsWithChildren<UserAnswerProps>> = ({
  text,
  isCorrect,
}) => (
  <Box>
    <b>YOU SAID:</b>{' '}
    <Text as="mark" backgroundColor={isCorrect ? 'green.100' : 'red.100'}>
      {text.length === 0 ? '<no answer>' : text}
    </Text>
  </Box>
);

export default UserAnswer;
