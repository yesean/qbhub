import { Button, CircularProgress, Flex, Input, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useAppSelector } from '../app/hooks';
import { selectQuestionSettings } from '../Settings/settingsSlice';
import { Answer } from '../types/tossups';
import { fetchAnswers } from '../utils/fetch';
import Answers from './Answers';

enum SearchStatus {
  search,
  fetching,
  answers,
}

const Search: React.FC = () => {
  const [search, setSearch] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [status, setStatus] = useState<SearchStatus>(SearchStatus.search);
  const questionSettings = useAppSelector(selectQuestionSettings);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const submitSearch = async () => {
    const FETCH_LIMIT = 100;
    setStatus(SearchStatus.fetching);
    setAnswers(
      await fetchAnswers({
        ...questionSettings,
        answer: search,
        limit: FETCH_LIMIT,
      }),
    );
    setStatus(SearchStatus.answers);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submitSearch();
    }
  };

  const render = () => {
    switch (status) {
      case SearchStatus.search:
        return (
          <Flex>
            <Input
              value={search}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              placeholder="Search for an answerline!"
              mr={4}
            />
            <Button onClick={submitSearch}>Search</Button>
          </Flex>
        );
      case SearchStatus.fetching:
        return <CircularProgress isIndeterminate color="cyan" />;
      case SearchStatus.answers:
        if (answers.length === 0) {
          return (
            <Text>No answers found. Try tweaking your search parameters.</Text>
          );
        }
        return <Answers answers={answers} />;
      default:
        return null;
    }
  };

  return render();
};

export default Search;
