import { createBrowserRouter, Outlet } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import About from './About';
import BonusReader from './BonusReader';
import Clues from './CluesGenerator/Clues';
import Search from './CluesGenerator/Search';
import Layout from './components/Layout';
import FrequencyList from './FrequencyList';
import KeyboardShortcutProvider from './providers/KeyboardShortcutProvider';
import ModalProvider from './providers/ModalProvider';
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

export default createBrowserRouter([
  {
    element: (
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        <ModalProvider>
          <KeyboardShortcutProvider>
            <Layout>
              <Outlet />
            </Layout>
          </KeyboardShortcutProvider>
        </ModalProvider>
      </QueryParamProvider>
    ),
    children: paths,
  },
]);
