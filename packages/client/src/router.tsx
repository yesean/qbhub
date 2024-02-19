import { createBrowserRouter, Outlet } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';

import About from './About';
import BonusReader from './BonusReader';
import ClueDisplay from './ClueGenerator/ClueDisplay';
import ClueSearch from './ClueGenerator/ClueSearch';
import Layout from './components/layout/Layout';
import RedirectToTossupReader from './components/routing/RedirectToTossupReader';
import FrequencyList from './FrequencyList';
import KeyboardShortcutProvider from './providers/KeyboardShortcutProvider';
import { ModalProvider } from './providers/ModalProvider';
import SettingsProvider from './providers/SettingsProvider';
import { ROUTES } from './routes';
import TossupReader from './TossupReader';

const paths = [
  {
    element: <TossupReader />,
    path: ROUTES.tossupReader.path,
  },
  {
    element: <BonusReader />,
    path: ROUTES.bonusReader.path,
  },
  {
    element: <FrequencyList />,
    path: ROUTES.frequencyList.path,
  },
  {
    element: <ClueSearch />,
    path: ROUTES.clueSearch.path,
  },
  {
    element: <ClueDisplay />,
    path: ROUTES.clueDisplay.path,
  },
  {
    element: <About />,
    path: ROUTES.about.path,
  },
  {
    element: <RedirectToTossupReader />,
    path: '*',
  },
];

const router = createBrowserRouter([
  {
    children: paths,
    element: (
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        <SettingsProvider>
          <ModalProvider>
            <KeyboardShortcutProvider>
              <Layout>
                <Outlet />
              </Layout>
            </KeyboardShortcutProvider>
          </ModalProvider>
        </SettingsProvider>
      </QueryParamProvider>
    ),
  },
]);

export default router;
