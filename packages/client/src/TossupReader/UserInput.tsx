import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import ReaderUserInput from '../components/reader/UserInput';
import useKeyboardShortcut from '../hooks/useKeyboardShortcut';
import { useSettings } from '../hooks/useSettings';
import { useAppDispatch } from '../redux/hooks';
import { ReaderStatus, getInputBorderColor } from '../utils/reader';
import {
  nextTossup as nextTossupAction,
  selectIsAnswering,
  selectTossupReader,
} from './tossupReaderSlice';

// button text depending on the status
const buttonTexts = new Map([
  [ReaderStatus.idle, 'Start Tossups'],
  [ReaderStatus.fetching, '...'],
  [ReaderStatus.reading, 'Buzz'],
  [ReaderStatus.answering, 'Submit'],
  [ReaderStatus.prompting, 'Submit'],
  [ReaderStatus.judged, 'Next'],
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
    current: { result },
    status,
  } = useSelector(selectTossupReader);
  const isAnswering = useSelector(selectIsAnswering);
  const [input, setInput] = useState('');
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const { settings } = useSettings();

  const isReading = status === ReaderStatus.reading;

  // clear input on new tossup
  useEffect(() => {
    if (isReading) {
      setInput('');
    }
  }, [isReading]);

  const focusInput = () => {
    if (inputRef?.current != null) {
      inputRef.current.disabled = false;
      inputRef.current.focus();
    }
  };

  const buzzWrapper = useCallback(() => {
    focusInput();
    buzz();
  }, [buzz]);
  const submitInput = useCallback(() => submit(input), [input, submit]);
  const next = () => dispatch(nextTossupAction({ settings }));

  // add different button behavior depending on the status
  let onClick;
  switch (status) {
    case ReaderStatus.idle:
    case ReaderStatus.judged:
      onClick = next;
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
  useKeyboardShortcut('n', next);
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
      borderColor={getInputBorderColor(status, result)}
      disabled={!isAnswering}
      input={input}
      inputRef={inputRef}
      onClick={onClick}
      placeholder={status === ReaderStatus.prompting ? 'Prompt:' : 'Answer:'}
      setInput={setInput}
      shouldSubmit={progress === 0}
      showBorder={status === ReaderStatus.judged}
      showInput={status !== ReaderStatus.idle}
      submit={submitInput}
      text={buttonTexts.get(status) ?? ''}
    />
  );
};

export default UserInput;
