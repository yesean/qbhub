import { Center } from '@chakra-ui/react';
import { Redirect, Route, Switch } from 'react-router-dom';
import CluesGenerator from '../../CluesGenerator';
import FrequencyList from '../../FrequencyList';
import TossupReader from '../../TossupReader';

const Body: React.FC = () => {
  return (
    <Center flexDir="column" overflow="auto" flex={1} p={3}>
      <Switch>
        <Route path="/reader">
          <TossupReader />
        </Route>
        <Route path="/freq">
          <FrequencyList />
        </Route>
        <Route path="/clues">
          <CluesGenerator />
        </Route>
        <Route>
          <Redirect to="/reader" />
        </Route>
      </Switch>
    </Center>
  );
};

export default Body;
