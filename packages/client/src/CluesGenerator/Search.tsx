import { Flex, Input } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import RouterLinkButton from '../components/buttons/RouterLinkButton';
import useInput from '../hooks/useInput';
import useKeyboardShortcut from '../hooks/useKeyboardShortcut';
import { useClueSearchRouteContext } from '../utils/routes';
import Answers from './Answers';

const Search: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { focusInput, inputRef, setUserInput, userInput } = useInput();
  const navigate = useNavigate();
  const { getURL: getClueSearchURL } = useClueSearchRouteContext();

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigate(getClueSearchURL({ query: userInput }));
    }
  };

  useKeyboardShortcut(
    '/',
    useCallback(
      (e) => {
        focusInput();
        e.preventDefault();
      },
      [focusInput],
    ),
  );

  return (
    <Flex gap={4}>
      <Input
        ref={inputRef}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Search for an answerline!"
        value={userInput}
      />
      <RouterLinkButton
        h={10}
        label="Search"
        to={getClueSearchURL({ query: userInput })}
      />
    </Flex>
  );
};

export default function SearchWrapper() {
  const {
    params: { query },
  } = useClueSearchRouteContext();

  return query === undefined ? <Search /> : <Answers query={query} />;
}
