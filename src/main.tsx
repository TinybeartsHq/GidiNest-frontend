import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router';

import App from './app';
import store from './redux/store';
import { routesSection } from './routes/pages';
import { ErrorBoundary } from './routes/components';
import { setupResponseInterceptor } from './utils/apiClient';

setupResponseInterceptor(store);

const router = createBrowserRouter([
  {
    Component: () => (
      <Provider store={store}>
        <App>
          <Outlet />
        </App>
      </Provider>
    ),
    errorElement: <ErrorBoundary />,
    children: routesSection,
  },
]);

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
