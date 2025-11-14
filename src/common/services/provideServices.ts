import { FetchHttpClient } from '@shlinkio/shlink-js-sdk/fetch';
import type Bottle from 'bottlejs';
import { withoutSelectedServer } from '../../servers/helpers/withoutSelectedServer';
import { Home } from '../Home';
import { ShlinkWebComponentContainerFactory } from '../ShlinkWebComponentContainer';

export const provideServices = (bottle: Bottle) => {
  // Services
  bottle.constant('window', window);
  bottle.constant('console', console);
  bottle.constant('fetch', window.fetch.bind(window));
  bottle.service('HttpClient', FetchHttpClient, 'fetch');

  bottle.serviceFactory('Home', () => Home);
  bottle.decorator('Home', withoutSelectedServer);

  bottle.factory('ShlinkWebComponentContainer', ShlinkWebComponentContainerFactory);
};
