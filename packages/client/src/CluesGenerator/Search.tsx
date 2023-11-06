import { Flex, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import RouterLinkButton from '../components/buttons/RouterLinkButton';
import { useAppDispatch } from '../redux/hooks';
import { useGetClueSearchURL } from '../utils/routes';
import Answers from './Answers';
import { setQuery } from './cluesGeneratorSlice';

const Search: React.FC<React.PropsWithChildren<unknown>> = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const getClueSearchURL = useGetClueSearchURL();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const submitSearch = async () => {
    dispatch(setQuery(search));
    navigate(getClueSearchURL(search));
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
        to={getClueSearchURL(search)}
        onClick={() => dispatch(setQuery(search))}
        label="Search"
        h={10}
      />
    </Flex>
  );
};

export default () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  return query == null ? <Search /> : <Answers />;
};
