import { Center } from '@chakra-ui/react';
import { useEffect } from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import About from '../../About';
import BonusReader from '../../BonusReader';
import CluesGenerator from '../../CluesGenerator';
import FrequencyList from '../../FrequencyList';
import TossupReader from '../../TossupReader';
import pino from '../../utils/pino';
import { ROUTES } from '../../utils/routes';

const Body: React.FC<React.PropsWithChildren<unknown>> = () => {
  const location = useLocation();

  useEffect(() => {
    pino.info({ pathname: location.pathname }, 'page_transition');
  }, [location.pathname]);

  return (
    <Center flexDir="column" overflow="auto" flex={1} px={3}>
      <Switch>
        <Route path={ROUTES.reader.tossup}>
          <TossupReader />
        </Route>
        <Route path={ROUTES.reader.bonus}>
          <BonusReader />
        </Route>
        <Route path={ROUTES.freq.root}>
          <FrequencyList />
        </Route>
        <Route path={ROUTES.clues.root}>
          <CluesGenerator />
        </Route>
        <Route path={ROUTES.about.root}>
          <About />
        </Route>
        <Route>
          <Redirect to={ROUTES.reader.tossup} />
        </Route>
      </Switch>
    </Center>
  );
};

export default Body;
