import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import ReaderUserInput from '../components/reader/UserInput';
import { useKeyboardShortcut } from '../hooks/keyboard';
import { useAppDispatch } from '../redux/hooks';
import { selectSettings } from '../Settings/settingsSlice';
import {
  buzz as buzzAction,
  nextTossup as nextTossupAction,
  ReaderStatus,
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
  progress: number;
  submit: (s: string) => void;
};
const UserInput: React.FC<React.PropsWithChildren<UserInputProps>> = ({
  progress,
  submit,
}) => {
  const {
    status,
    current: { result },
  } = useSelector(selectTossupReader);
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
    if (status !== ReaderStatus.reading) return;

    if (inputRef?.current != null) {
      inputRef.current.disabled = false;
      inputRef.current.focus();
    }
    dispatch(buzzAction());
  }, [dispatch, status]);
  const submitInput = useCallback(() => submit(input), [input, submit]);
  const next = useCallback(() => dispatch(nextTossupAction()), [dispatch]);

  // add different button behavior depending on the status
  let onClick;
  switch (status) {
    case ReaderStatus.idle:
    case ReaderStatus.judged:
      onClick = next;
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
  useKeyboardShortcut('n', next, () => !settings.isOpen);
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
  if (status !== ReaderStatus.judged) borderColor = 'gray.300';
  else if (result.isCorrect) borderColor = 'green.400';
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
      showBorder={status === ReaderStatus.judged}
      showInput={status !== ReaderStatus.idle}
      inputRef={inputRef}
    />
  );
};

export default UserInput;
