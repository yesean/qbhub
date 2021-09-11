import { Center } from '@chakra-ui/react';
import { Redirect, Route, Switch } from 'react-router-dom';
import FreqList from '../FreqList';
import TossupReader from '../TossupReader';

const Body: React.FC = () => {
  return (
    <Center flexGrow={1} p={4} overflow="auto">
      <Switch>
        <Route path="/reader">
          <TossupReader />
        </Route>
        <Route path="/freq">
          <FreqList />
        </Route>
        <Route>
          <Redirect to="/reader" />
        </Route>
      </Switch>
    </Center>
  );
};

export default Body;
