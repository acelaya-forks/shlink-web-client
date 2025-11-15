import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import pack from '../package.json';
import { ErrorHandler } from './common/ErrorHandler';
import { ScrollToTop } from './common/ScrollToTop';
import { container } from './container';
import { ContainerProvider } from './container/context';
import { register as registerServiceWorker } from './serviceWorkerRegistration';
import { setUpStore } from './store';
import './tailwind.css';

const store = setUpStore();
const { App, appUpdateAvailable } = container;

createRoot(document.getElementById('root')!).render(
  <ContainerProvider value={container}>
    <Provider store={store}>
      <BrowserRouter basename={pack.homepage}>
        <ErrorHandler>
          <ScrollToTop>
            <App />
          </ScrollToTop>
        </ErrorHandler>
      </BrowserRouter>
    </Provider>
  </ContainerProvider>,
);

// Learn more about service workers: https://cra.link/PWA
registerServiceWorker({
  onUpdate() {
    store.dispatch(appUpdateAvailable());
  },
});
