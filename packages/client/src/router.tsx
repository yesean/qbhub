import { createBrowserRouter, Outlet } from 'react-router-dom';
import About from './About';
import BonusReader from './BonusReader';
import Clues from './CluesGenerator/Clues';
import Search from './CluesGenerator/Search';
import Layout from './components/Layout';
import FrequencyList from './FrequencyList';
import KeyboardShortcutProvider from './providers/KeyboardShortcutProvider';
import ModalProvider from './providers/ModalProvider';
import TossupReader from './TossupReader';
import { ROUTES } from './utils/routes';

export default createBrowserRouter([
  {
    element: (
      <ModalProvider>
        <KeyboardShortcutProvider>
          <Layout>
            <Outlet />
          </Layout>
        </KeyboardShortcutProvider>
      </ModalProvider>
    ),
    children: [
      {
        path: ROUTES.tossupReader,
        element: <TossupReader />,
      },
      {
        path: ROUTES.bonusReader,
        element: <BonusReader />,
      },
      {
        path: ROUTES.frequencyList,
        element: <FrequencyList />,
      },
      {
        path: ROUTES.clue.search,
        element: <Search />,
      },
      {
        path: ROUTES.clue.display,
        element: <Clues />,
      },
      {
        path: ROUTES.about,
        element: <About />,
      },
    ],
  },
]);
