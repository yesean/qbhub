import { Box, Text } from '@chakra-ui/react';

type UserAnswerProps = {
  isCorrect: boolean;
  text: string;
};

const UserAnswer: React.FC<React.PropsWithChildren<UserAnswerProps>> = ({
  isCorrect,
  text,
}) => (
  <Box>
    <b>YOU SAID:</b>{' '}
    <Text as="mark" backgroundColor={isCorrect ? 'green.100' : 'red.100'}>
      {text.length === 0 ? '<no answer>' : text}
    </Text>
  </Box>
);

export default UserAnswer;
