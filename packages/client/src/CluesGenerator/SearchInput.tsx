import { Flex, Input } from '@chakra-ui/react';
import { useDebounce } from '@uidotdev/usehooks';
import { useCallback, useEffect } from 'react';
import RouterLinkButton from '../components/buttons/RouterLinkButton';
import useInput from '../hooks/useInput';
import useKeyboardShortcut from '../hooks/useKeyboardShortcut';
import { useClueSearchRouteContext } from '../utils/routes';

export default function SearchInput() {
  const { getURL: getClueSearchURL } = useClueSearchRouteContext();
  const { blurInput, focusInput, inputRef, setUserInput, userInput } =
    useInput();
  const debouncedUserInput = useDebounce(userInput, 300);

  useEffect(() => {
    getClueSearchURL({ query: debouncedUserInput }).go();
  }, [debouncedUserInput, getClueSearchURL]);

  const handleForwardSlash = useCallback(
    (e: KeyboardEvent) => {
      focusInput();
      e.preventDefault();
    },
    [focusInput],
  );

  useKeyboardShortcut('/', handleForwardSlash);
  useKeyboardShortcut('Escape', blurInput, { allowHTMLInput: true });

  return (
    <Flex gap={4}>
      <Input
        ref={inputRef}
        h="100%"
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Search for an answerline!"
        value={userInput}
      />
      <RouterLinkButton
        label="Search"
        to={getClueSearchURL({ query: debouncedUserInput })}
      />
    </Flex>
  );
}
