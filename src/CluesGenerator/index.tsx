import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import Answers from './Answers';
import Clues from './Clues';
import Search from './Search';

const CluesGenerator: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/search`}>
        <Search />
      </Route>
      <Route exact path={`${path}/search/:answer`}>
        <Answers />
      </Route>
      <Route exact path={`${path}/display/:answer`}>
        <Clues />
      </Route>
      <Redirect to={`${path}/search`} />
    </Switch>
  );
};

export default CluesGenerator;
