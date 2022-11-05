import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import ReaderUserInput from '../components/reader/UserInput';
import { useKeyboardShortcut } from '../hooks/keyboard';
import { useAppDispatch } from '../redux/hooks';
import { selectSettings } from '../Settings/settingsSlice';
import { ReaderStatus } from '../types/reader';
import { getInputBorderColor } from '../utils/reader';
import {
  nextBonus as nextBonusAction,
  nextBonusPart as nextBonusPartAction,
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
  buzz: () => void;
};
const UserInput: React.FC<React.PropsWithChildren<UserInputProps>> = ({
  progress,
  submit,
  buzz,
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

  const isReading = status === ReaderStatus.reading;

  // clear input on new tossup
  useEffect(() => {
    if (status === ReaderStatus.reading) {
      setInput('');
    }
  }, [status]);

  const focusInput = () => {
    if (inputRef?.current != null) {
      inputRef.current.disabled = false;
      inputRef.current.focus();
    }
  };

  const buzzWrapper = () => {
    focusInput();
    buzz();
  };
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
      onClick = buzzWrapper;
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
  useKeyboardShortcut(' ', buzzWrapper, () => !settings.isOpen && isReading);
  useKeyboardShortcut('Enter', submitInput, () => !settings.isOpen);

  // submit user answer when timer ends
  useEffect(() => {
    if (isAnswering && progress === 0) {
      submitInput();
    }
  }, [isAnswering, progress, submitInput]);

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
      borderColor={getInputBorderColor(status, partResult)}
      showBorder={[ReaderStatus.partialJudged, ReaderStatus.judged].includes(
        status,
      )}
      showInput={status !== ReaderStatus.idle}
      inputRef={inputRef}
    />
  );
};

export default UserInput;
