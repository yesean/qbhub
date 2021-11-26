import { Redirect, Route, Switch } from 'react-router-dom';
import { ROUTES } from '../utils/routes';
import Answers from './Answers';
import Clues from './Clues';
import Search from './Search';

const CluesGenerator: React.FC = () => {
  return (
    <Switch>
      <Route exact path={ROUTES.clues.search}>
        <Search />
      </Route>
      <Route exact path={ROUTES.clues.searchResults(':answer')}>
        <Answers />
      </Route>
      <Route exact path={ROUTES.clues.display(':answer')}>
        <Clues />
      </Route>
      <Redirect to={ROUTES.clues.search} />
    </Switch>
  );
};

export default CluesGenerator;
