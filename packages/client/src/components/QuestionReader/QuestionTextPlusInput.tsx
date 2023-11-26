import { Box, Flex, Input } from '@chakra-ui/react';
import { TossupResult } from '@qbhub/types';
import { useCallback, useMemo, useRef, useState } from 'react';
import useKeyboardShortcut from '../../hooks/useKeyboardShortcut';
import {
  Judge,
  JudgeResult,
  getTossupScore,
  getTossupWords,
} from '../../utils/reader';
import TealButton from '../buttons/TealButton';
import FormattedQuestion from '../reader/FormattedQuestion';
import {
  QuestionReaderStatus,
  getNextStatus,
  useQuestionReaderContext,
} from './QuestionReaderContext';
import QuestionReaderProgress from './QuestionReaderProgress';
import useRevealer from './useRevealer';

export const getInputBorderColor = (
  status: QuestionReaderStatus,
  questionResult: TossupResult | null,
) => {
  if (status !== QuestionReaderStatus.Judged || questionResult == null)
    return 'gray.300';

  if (questionResult.isCorrect) return 'green.400';
  return 'red.400';
};

type Props = {};

export default (_: Props) => {
  const [userInput, setUserInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { question, status, setStatus, questionResult, setQuestionResult } =
    useQuestionReaderContext();

  const textWords = useMemo(
    () => getTossupWords(question.formattedText),
    [question.formattedText],
  );

  // buzz action: focus input, change status
  // can be triggered by button click or revealer finishing
  const handleBuzz = useCallback(() => {
    if (status !== QuestionReaderStatus.Reading) return;

    if (inputRef.current != null) {
      inputRef.current.disabled = false;
      inputRef.current.focus();
    }
    setStatus(getNextStatus(status));
  }, [setStatus, status]);

  const { visibleIndex, pause, reveal } = useRevealer({
    words: textWords,
    onFinish: handleBuzz, // trigger buzz automatically once the reader is finished
  });

  // submit action: blur input, reveal answer, evaluate user answer
  // can be triggered by button click or progress bar finishing
  const handleSubmit = useCallback(() => {
    if (status !== QuestionReaderStatus.Answering) return;

    inputRef.current?.blur();
    reveal();

    // evaluate user answer
    const judge = new Judge(question.formattedAnswer);
    const isCorrect = judge.judge(userInput) === JudgeResult.correct;
    const isInPower =
      visibleIndex === -1 ? false : textWords[visibleIndex].bold;
    const isBuzzAtEnd = visibleIndex === textWords.length - 1;
    setQuestionResult({
      buzzIndex: visibleIndex,
      isCorrect,
      userAnswer: userInput,
      words: textWords,
      tossup: question,
      score: getTossupScore(isCorrect, isInPower, isBuzzAtEnd),
    });

    setStatus(getNextStatus(status));
  }, [
    question,
    reveal,
    setQuestionResult,
    setStatus,
    status,
    textWords,
    userInput,
    visibleIndex,
  ]);

  const handleClick = useCallback(() => {
    switch (status) {
      case QuestionReaderStatus.Reading: {
        // pause the reader and trigger buzz
        pause();
        handleBuzz();
        break;
      }
      case QuestionReaderStatus.Answering: {
        handleSubmit();
        break;
      }
      case QuestionReaderStatus.Judged: {
        inputRef.current?.blur();
        setStatus(getNextStatus(status));
        break;
      }
    }
  }, [handleBuzz, handleSubmit, pause, setStatus, status]);

  useKeyboardShortcut(' ', handleClick, {
    customAllowCondition: status === QuestionReaderStatus.Reading,
  });

  useKeyboardShortcut('Enter', handleClick, {
    allowHTMLInput: true,
    customAllowCondition: status === QuestionReaderStatus.Answering,
  });

  useKeyboardShortcut('n', handleClick, {
    customAllowCondition: status === QuestionReaderStatus.Judged,
  });

  const shouldShowProgress = status === QuestionReaderStatus.Answering;
  const shouldShowBorder = status === QuestionReaderStatus.Judged;

  return (
    <>
      <Box overflow="auto" bg="gray.100" p={4} borderRadius="md">
        <FormattedQuestion
          words={textWords}
          indices={{ visible: visibleIndex, buzz: questionResult?.buzzIndex }}
        />
      </Box>
      {shouldShowProgress && <QuestionReaderProgress onFinish={handleSubmit} />}
      <Flex w="100%" justify="center">
        <Input
          ref={inputRef}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Answer"
          mr={4}
          isDisabled={status !== QuestionReaderStatus.Answering}
          borderColor={getInputBorderColor(status, questionResult)}
          borderWidth={shouldShowBorder ? 2 : undefined}
        />
        <TealButton onClick={handleClick}>Buzz</TealButton>
      </Flex>
    </>
  );
};
