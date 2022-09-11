import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../redux/hooks';
import ReaderUserInput from '../components/reader/UserInput';
import { useKeyboardShortcut } from '../hooks/keyboard';
import { selectSettings } from '../Settings/settingsSlice';
import {
  buzz as buzzAction,
  nextBonus as nextBonusAction,
  nextBonusPart as nextBonusPartAction,
  ReaderStatus,
  selectBonusReader,
  selectIsAnswering,
} from './bonusReaderSlice';

// button text depending on the status
const buttonTexts = new Map([
  [ReaderStatus.idle, 'Start Bonuses'],
  [ReaderStatus.fetching, '...'],
  [ReaderStatus.reading, 'Buzz'],
  [ReaderStatus.answering, 'Submit'],
  [ReaderStatus.prompting, 'Submit'],
  [ReaderStatus.judged, 'Next'],
  [ReaderStatus.partialJudged, 'Continue'],
]);

type UserInputProps = {
  progress: number;
  submit: (s: string) => void;
};
const UserInput: React.FC<React.PropsWithChildren<UserInputProps>> = ({
  progress,
  submit,
}) => {
  const {
    status,
    current: { partResult },
  } = useSelector(selectBonusReader);
  const settings = useSelector(selectSettings);
  const isAnswering = useSelector(selectIsAnswering);
  const [input, setInput] = useState('');
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  // clear input on new tossup
  useEffect(() => {
    if (status === ReaderStatus.reading) {
      setInput('');
    }
  }, [status]);

  const buzz = useCallback(() => {
    if (inputRef?.current != null) {
      inputRef.current.disabled = false;
      inputRef.current.focus();
    }
    dispatch(buzzAction());
  }, [dispatch]);
  const submitInput = useCallback(() => submit(input), [input, submit]);
  const next = useCallback(() => dispatch(nextBonusAction()), [dispatch]);
  const nextPart = useCallback(
    () => dispatch(nextBonusPartAction()),
    [dispatch],
  );

  // add different button behavior depending on the status
  let onClick;
  switch (status) {
    case ReaderStatus.idle:
    case ReaderStatus.judged:
      onClick = next;
      break;
    case ReaderStatus.partialJudged:
      onClick = nextPart;
      break;
    case ReaderStatus.reading:
      onClick = buzz;
      break;
    case ReaderStatus.answering:
      onClick = submitInput;
      break;
    default:
      onClick = () => {};
  }

  // add keyboard shortcuts
  useKeyboardShortcut(
    'n',
    status === ReaderStatus.partialJudged ? nextPart : next,
    () => !settings.isOpen,
  );
  useKeyboardShortcut(' ', buzz, () => !settings.isOpen);
  useKeyboardShortcut('Enter', submitInput, () => !settings.isOpen);

  // submit user answer when timer ends
  useEffect(() => {
    if (isAnswering && progress === 0) {
      submitInput();
    }
  }, [isAnswering, progress, submitInput]);

  // default, correct answer, incorrect answer
  let borderColor;
  if (![ReaderStatus.partialJudged, ReaderStatus.judged].includes(status))
    borderColor = 'gray.300';
  else if (partResult.isCorrect) borderColor = 'green.400';
  else borderColor = 'red.400';

  return (
    <ReaderUserInput
      input={input}
      setInput={setInput}
      placeholder={status === ReaderStatus.prompting ? 'Prompt:' : 'Answer:'}
      text={buttonTexts.get(status) ?? ''}
      onClick={onClick}
      submit={submitInput}
      shouldSubmit={progress === 0}
      disabled={!isAnswering}
      borderColor={borderColor}
      showBorder={[ReaderStatus.partialJudged, ReaderStatus.judged].includes(
        status,
      )}
      showInput={status !== ReaderStatus.idle}
      inputRef={inputRef}
    />
  );
};

export default UserInput;
