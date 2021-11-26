import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { useKeyboardShortcut } from '../hooks/keyboard';
import { ROUTES } from '../utils/routes';
import Answers from './Answers';
import Clues from './Clues';
import Search from './Search';

const CluesGenerator: React.FC = () => {
  const history = useHistory();

  const predicate = (e: KeyboardEvent) => e.target === document.body;
  useKeyboardShortcut('/', () => history.push(ROUTES.clues.search), predicate);

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
