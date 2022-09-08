import { Box } from '@chakra-ui/react';
import React from 'react';
import Answer from '../components/reader/Answer';
import UserAnswer from '../components/reader/UserAnswer';
import { BonusPart, BonusPartResult } from '../types/bonus';
import { getTossupWords, renderQuestion } from '../utils/reader';

type PreviousQuestionProps = {
  part: BonusPart;
  partResult: BonusPartResult;
};

const PreviousQuestion = ({ part, partResult }: PreviousQuestionProps) => {
  const displayQuestionWords = getTossupWords(part.formattedText);

  return (
    <Box mb={4}>
      {renderQuestion(displayQuestionWords)}
      <Box mt={1} py={1}>
        <Answer text={part.formattedAnswer} />
        <UserAnswer
          text={partResult.userAnswer}
          isCorrect={partResult.isCorrect}
        />
      </Box>
    </Box>
  );
};

export default PreviousQuestion;
