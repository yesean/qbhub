import { createBrowserRouter, Outlet } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import About from './About';
import BonusReader from './BonusReader';
import Clues from './CluesGenerator/Clues';
import Search from './CluesGenerator/Search';
import Layout from './components/Layout';
import NavigateToTossupReader from './components/NavigateToTossupReader';
import FrequencyList from './FrequencyList';
import KeyboardShortcutProvider from './providers/KeyboardShortcutProvider';
import { ModalProvider } from './providers/ModalProvider';
import SettingsProvider from './providers/SettingsProvider';
import TossupReader from './TossupReader';
import TossupReaderNew from './TossupReaderNew';
import {
  getAboutURL,
  getBonusReaderURL,
  getClueDisplayURL,
  getClueSearchURL,
  getFrequencyListURL,
  getTossupReaderNewURL,
  getTossupReaderURL,
} from './utils/routes';

const paths = [
  {
    path: '/',
    element: <NavigateToTossupReader />,
  },
  {
    path: getTossupReaderNewURL(),
    element: <TossupReaderNew />,
  },
  {
    path: getTossupReaderURL(),
    element: <TossupReader />,
  },
  {
    path: getBonusReaderURL(),
    element: <BonusReader />,
  },
  {
    path: getFrequencyListURL(),
    element: <FrequencyList />,
  },
  {
    path: getClueSearchURL(),
    element: <Search />,
  },
  {
    path: getClueDisplayURL(),
    element: <Clues />,
  },
  {
    path: getAboutURL(),
    element: <About />,
  },
];

const router = createBrowserRouter([
  {
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
    children: paths,
  },
]);

export default router;
