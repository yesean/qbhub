import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Clues from './Clues';
import Search from './Search';

const CluesGenerator: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/`}>
        <Search />
      </Route>
      <Route path={`${path}/:answer`}>
        <Clues />
      </Route>
    </Switch>
  );
};

export default CluesGenerator;
