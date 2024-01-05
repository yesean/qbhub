import { Text } from '@chakra-ui/react';
import { TossupResult } from '@qbhub/types';

type TossupResultUserInputProps = {
  result: TossupResult;
};

export default function TossupResultUserInput({
  result: { isCorrect, userAnswer },
}: TossupResultUserInputProps) {
  return (
    <Text>
      <Text as="b">YOU SAID: </Text>
      <Text as="mark" backgroundColor={isCorrect ? 'green.100' : 'red.100'}>
        {userAnswer.trim().length === 0 ? '<no answer>' : userAnswer}
      </Text>
    </Text>
  );
}
