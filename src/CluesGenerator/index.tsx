import { Redirect, Route, Switch } from 'react-router-dom';
import { ROUTES } from '../utils/routes';
import Answers from './Answers';
import Clues from './Clues';
import Search from './Search';

const CluesGenerator: React.FC = () => {
  return (
    <Switch>
      <Route exact path={ROUTES.cluesSearch}>
        <Search />
      </Route>
      <Route exact path={ROUTES.cluesSearchResults(':answer')}>
        <Answers />
      </Route>
      <Route exact path={ROUTES.cluesDisplay(':answer')}>
        <Clues />
      </Route>
      <Redirect to={ROUTES.cluesSearch} />
    </Switch>
  );
};

export default CluesGenerator;
