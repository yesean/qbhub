import { Flex, Input } from '@chakra-ui/react';
import { useDebounce } from '@uidotdev/usehooks';
import { useCallback, useEffect } from 'react';

import RouterLinkButton from '../components/buttons/RouterLinkButton';
import useInput from '../hooks/useInput';
import useKeyboardShortcut from '../hooks/useKeyboardShortcut';
import { ROUTES } from '../routes';

export default function ClueSearchInput() {
  const {
    getURL: getClueSearchURL,
    params: { query },
  } = ROUTES.clueSearch.useRouteContext();
  const { blurInput, focusInput, inputRef, setUserInput, userInput } =
    useInput(query);
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
        h="auto" // fill the height of the flexbox container, height: 100% doesn't work because there's no parent height
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
