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
    element: <NavigateToTossupReader />,
    path: '/',
  },
  {
    element: <TossupReaderNew />,
    path: getTossupReaderNewURL(),
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
    element: <Search />,
    path: getClueSearchURL(),
  },
  {
    element: <Clues />,
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
