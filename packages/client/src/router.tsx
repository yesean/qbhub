import { createBrowserRouter, Outlet } from 'react-router-dom';
import About from './About';
import BonusReader from './BonusReader';
import Answers from './CluesGenerator/Answers';
import Clues from './CluesGenerator/Clues';
import Search from './CluesGenerator/Search';
import Layout from './components/Layout';
import FrequencyList from './FrequencyList';
import KeyboardShortcutProvider from './providers/KeyboardShortcutProvider';
import TossupReader from './TossupReader';

export default createBrowserRouter([
  {
    element: (
      <KeyboardShortcutProvider>
        <Layout>
          <Outlet />
        </Layout>
      </KeyboardShortcutProvider>
    ),
    children: [
      {
        path: 'tossup',
        element: <TossupReader />,
      },
      {
        path: 'bonus',
        element: <BonusReader />,
      },
      {
        path: 'frequency',
        element: <FrequencyList />,
      },
      {
        path: 'clue',
        children: [
          {
            index: true,
            element: <Search />,
          },
          {
            path: 'search/:answer',
            element: <Answers />,
          },
          {
            path: 'display/:answer',
            element: <Clues />,
          },
        ],
      },
      {
        path: 'about',
        element: <About />,
      },
    ],
  },
]);
