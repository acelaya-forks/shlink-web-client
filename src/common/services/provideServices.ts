import { FetchHttpClient } from '@shlinkio/shlink-js-sdk/fetch';
import type Bottle from 'bottlejs';
import type { ConnectDecorator } from '../../container/types';
import { withoutSelectedServer } from '../../servers/helpers/withoutSelectedServer';
import { ErrorHandler } from '../ErrorHandler';
import { Home } from '../Home';
import { ScrollToTop } from '../ScrollToTop';
import { ShlinkWebComponentContainerFactory } from '../ShlinkWebComponentContainer';

export const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  // Services
  bottle.constant('window', window);
  bottle.constant('console', console);
  bottle.constant('fetch', window.fetch.bind(window));
  bottle.service('HttpClient', FetchHttpClient, 'fetch');

  // Components
  bottle.serviceFactory('ScrollToTop', () => ScrollToTop);

  bottle.serviceFactory('Home', () => Home);
  bottle.decorator('Home', withoutSelectedServer);

  bottle.factory('ShlinkWebComponentContainer', ShlinkWebComponentContainerFactory);
  bottle.decorator('ShlinkWebComponentContainer', connect(['settings'], []));

  bottle.serviceFactory('ErrorHandler', () => ErrorHandler);
};
