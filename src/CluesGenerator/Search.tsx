import { Flex, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { RouterLinkButton } from '../components/buttons';
import { ROUTES } from '../utils/routes';
import { setQuery } from './cluesGeneratorSlice';

const Search: React.FC<React.PropsWithChildren<unknown>> = () => {
  const [search, setSearch] = useState('');
  const history = useHistory();
  const dispatch = useAppDispatch();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const submitSearch = async () => {
    dispatch(setQuery(search));
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
      <RouterLinkButton
        to={ROUTES.clues.searchResults(search)}
        onClick={() => dispatch(setQuery(search))}
        label="Search"
        h={10}
      />
    </Flex>
  );
};

export default Search;
