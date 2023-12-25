import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  nextBonus as nextBonusAction,
  nextBonusPart as nextBonusPartAction,
  selectBonusReader,
  selectIsAnswering,
} from '../BonusReader/bonusReaderSlice';
import ReaderUserInput from '../components/reader/UserInput';
import useKeyboardShortcut from '../hooks/useKeyboardShortcut';
import { useSettings } from '../hooks/useSettings';
import { useAppDispatch } from '../redux/hooks';
import { ReaderStatus, getInputBorderColor } from '../utils/reader';

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
  buzz: () => void;
  progress: number;
  submit: (s: string) => void;
};
const UserInput: React.FC<React.PropsWithChildren<UserInputProps>> = ({
  buzz,
  progress,
  submit,
}) => {
  const {
    current: { partResult },
    status,
  } = useSelector(selectBonusReader);
  const { settings } = useSettings();
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
  const next = useCallback(
    () => dispatch(nextBonusAction({ settings })),
    [dispatch, settings],
  );
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
  const nextWrapper = status === ReaderStatus.partialJudged ? nextPart : next;
  useKeyboardShortcut('n', nextWrapper);
  useKeyboardShortcut(' ', buzzWrapper, {
    customAllowCondition: isReading,
  });
  useKeyboardShortcut('Enter', submitInput, {
    allowHTMLInput: true,
    customAllowCondition: isAnswering,
  });

  // submit user answer when timer ends
  useEffect(() => {
    if (isAnswering && progress === 0) {
      submitInput();
    }
  }, [isAnswering, progress, submitInput]);

  return (
    <ReaderUserInput
      borderColor={getInputBorderColor(status, partResult)}
      disabled={!isAnswering}
      input={input}
      inputRef={inputRef}
      onClick={onClick}
      placeholder={status === ReaderStatus.prompting ? 'Prompt:' : 'Answer:'}
      setInput={setInput}
      shouldSubmit={progress === 0}
      showBorder={[ReaderStatus.partialJudged, ReaderStatus.judged].includes(
        status,
      )}
      showInput={status !== ReaderStatus.idle}
      submit={submitInput}
      text={buttonTexts.get(status) ?? ''}
    />
  );
};

export default UserInput;
