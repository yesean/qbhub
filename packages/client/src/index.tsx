import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';
import '@fontsource/raleway/700.css';

import { ChakraProvider } from '@chakra-ui/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import { store } from './redux/store';
import router from './router';
import theme from './theme';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <ReduxProvider store={store}>
      <ChakraProvider
        theme={theme}
        toastOptions={{
          defaultOptions: {
            containerStyle: { width: 350 },
            variant: 'left-accent',
          },
        }}
      >
        <RouterProvider router={router} />
      </ChakraProvider>
    </ReduxProvider>
  </StrictMode>,
);
