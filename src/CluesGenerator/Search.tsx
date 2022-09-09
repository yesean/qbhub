import { Flex, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { TealButton } from '../components/buttons';
import { ROUTES } from '../utils/routes';

const Search: React.FC<React.PropsWithChildren<unknown>> = () => {
  const [search, setSearch] = useState('');
  const history = useHistory();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const submitSearch = async () => {
    history.push(ROUTES.clues.searchResults(search));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submitSearch();
    }
  };

  return (
    <Flex>
      <Input
        value={search}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        placeholder="Search for an answerline!"
        mr={4}
      />
      <TealButton onClick={submitSearch}>Search</TealButton>
    </Flex>
  );
};

export default Search;
