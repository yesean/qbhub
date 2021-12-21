import { CircularProgress, Heading, Text, Tooltip } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { TwoColumnTable } from '../components/Table';
import { Clue } from '../types/tossups';
import {
  CluesGeneratorStatus,
  fetchClues,
  selectCluesGenerator,
} from './cluesGeneratorSlice';

const cluesFields = [
  { label: 'Clue', dataKey: 'clue' },
  { label: 'Score', dataKey: 'score' },
] as const;

const Clues: React.FC = () => {
  const { status, clues } = useAppSelector(selectCluesGenerator);
  const dispatch = useAppDispatch();
  const { answer } = useParams<{ answer: string }>();

  useEffect(() => {
    dispatch(fetchClues(answer));
  }, [dispatch, answer]);

  const renderTooltip = (clue: Clue) => {
    const startIndex = clue.sentence.indexOf(clue.clue);
    if (startIndex === -1) {
      return (
        <>
          <Heading size="sm" mb={1}>
            {clue.tournament}
          </Heading>
          <Text>{clue.sentence}</Text>
        </>
      );
    }
    return (
      <>
        <Heading size="sm" mb={1}>
          {clue.tournament}
        </Heading>
        <Text display="inline">{clue.sentence.substring(0, startIndex)}</Text>
        <Text display="inline" as="mark" bgColor="#fffea9">
          {clue.sentence.substring(startIndex, startIndex + clue.clue.length)}
        </Text>
        <Text display="inline">
          {clue.sentence.substring(startIndex + clue.clue.length)}
        </Text>
      </>
    );
  };

  const renderClue = (clue: Clue) => {
    return (
      <Tooltip
        hasArrow
        placement="top"
        label={renderTooltip(clue)}
        borderRadius="5px"
        p={2}
      >
        <Text>{clue.clue}</Text>
      </Tooltip>
    );
  };

  const render = () => {
    if (status !== CluesGeneratorStatus.idle) {
      return <CircularProgress isIndeterminate color="cyan" />;
    }
    return (
      <TwoColumnTable
        data={clues.map((clue) => ({ ...clue, clue: renderClue(clue) }))}
        headers={cluesFields}
        width={600}
        height={700}
      />
    );
  };

  return render();
};

export default Clues;
