import { Center } from '@chakra-ui/react';
import { Redirect, Route, Switch } from 'react-router-dom';
import CluesGenerator from '../../CluesGenerator';
import FrequencyList from '../../FrequencyList';
import TossupReader from '../../TossupReader';
import { ROUTES } from '../../utils/routes';

const Body: React.FC = () => {
  return (
    <Center flexDir="column" overflow="auto" flex={1} p={3}>
      <Switch>
        <Route path={ROUTES.reader.tossup}>
          <TossupReader />
        </Route>
        <Route path={ROUTES.freq.root}>
          <FrequencyList />
        </Route>
        <Route path={ROUTES.clues.root}>
          <CluesGenerator />
        </Route>
        <Route>
          <Redirect to={ROUTES.reader.tossup} />
        </Route>
      </Switch>
    </Center>
  );
};

export default Body;
