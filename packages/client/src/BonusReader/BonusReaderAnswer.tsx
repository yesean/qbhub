import { Box, Text } from '@chakra-ui/react';
import { BonusPartResult } from '@qbhub/types';
import { parseHTMLString } from '../utils/string';

type BonusReaderAnswerProps = {
  bonusPartResult: BonusPartResult;
};

export default function BonusReaderAnswer({
  bonusPartResult: { bonusPart, isCorrect, userAnswer },
}: BonusReaderAnswerProps) {
  const formattedAnswerDisplay = parseHTMLString(bonusPart.formattedAnswer);

  return (
    <Box>
      <Box as="span">
        <Text as="b">ANSWER:</Text> {formattedAnswerDisplay}
      </Box>
      <Box>
        <Text as="b">YOU SAID:</Text>{' '}
        <Text as="mark" backgroundColor={isCorrect ? 'green.100' : 'red.100'}>
          {userAnswer.trim().length === 0 ? '<no answer>' : userAnswer}
        </Text>
      </Box>
    </Box>
  );
}
