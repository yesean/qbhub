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
        <Route path={ROUTES.tossupReader}>
          <TossupReader />
        </Route>
        <Route path={ROUTES.freq}>
          <FrequencyList />
        </Route>
        <Route path={ROUTES.cluesRoot}>
          <CluesGenerator />
        </Route>
        <Route>
          <Redirect to={ROUTES.tossupReader} />
        </Route>
      </Switch>
    </Center>
  );
};

export default Body;
