import { createBrowserRouter, Outlet } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import About from './About';
import BonusReader from './BonusReader';
import ClueDisplay from './ClueGenerator/ClueDisplay';
import ClueSearch from './ClueGenerator/ClueSearch';
import Layout from './components/Layout';
import RedirectToTossupReader from './components/RedirectToTossupReader';
import FrequencyList from './FrequencyList';
import KeyboardShortcutProvider from './providers/KeyboardShortcutProvider';
import { ModalProvider } from './providers/ModalProvider';
import SettingsProvider from './providers/SettingsProvider';
import TossupReader from './TossupReader';
import {
  getAboutURL,
  getBonusReaderURL,
  getClueDisplayURL,
  getClueSearchURL,
  getFrequencyListURL,
  getTossupReaderURL,
} from './utils/routes';

const paths = [
  {
    element: <RedirectToTossupReader />,
    path: '/',
  },
  {
    element: <TossupReader />,
    path: getTossupReaderURL(),
  },
  {
    element: <BonusReader />,
    path: getBonusReaderURL(),
  },
  {
    element: <FrequencyList />,
    path: getFrequencyListURL(),
  },
  {
    element: <ClueSearch />,
    path: getClueSearchURL(),
  },
  {
    element: <ClueDisplay />,
    path: getClueDisplayURL(),
  },
  {
    element: <About />,
    path: getAboutURL(),
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
