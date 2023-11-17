import { Flex, Input } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RouterLinkButton from '../components/buttons/RouterLinkButton';
import { useAppDispatch } from '../redux/hooks';
import { useClueSearchRouteContext } from '../utils/routes';
import Answers from './Answers';
import { setQuery } from './cluesGeneratorSlice';

const Search: React.FC<React.PropsWithChildren<unknown>> = () => {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { getURL: getClueSearchURL } = useClueSearchRouteContext();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const submitSearch = async () => {
    dispatch(setQuery(search));
    navigate(getClueSearchURL({ query: search }));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submitSearch();
    }
  };

  return (
    <Flex gap={4}>
      <Input
        value={search}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        placeholder="Search for an answerline!"
        ref={inputRef}
      />
      <RouterLinkButton
        to={getClueSearchURL({ query: search })}
        onClick={() => dispatch(setQuery(search))}
        label="Search"
        h={10}
      />
    </Flex>
  );
};

export default () => {
  const {
    params: { query },
  } = useClueSearchRouteContext();

  return query == null ? <Search /> : <Answers query={query} />;
};
