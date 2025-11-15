import { useTimeoutToggle } from '@shlinkio/shlink-frontend-kit';
import { FetchHttpClient } from '@shlinkio/shlink-js-sdk/fetch';
import Bottle from 'bottlejs';
import { buildShlinkApiClient } from '../api/services/ShlinkApiClientBuilder';
import { AppFactory } from '../app/App';
import { Home } from '../common/Home';
import { ShlinkWebComponentContainerFactory } from '../common/ShlinkWebComponentContainer';
import { CreateServerFactory } from '../servers/CreateServer';
import { ImportServersBtnFactory } from '../servers/helpers/ImportServersBtn';
import { withoutSelectedServer } from '../servers/helpers/withoutSelectedServer';
import { ManageServersFactory } from '../servers/ManageServers';
import { ServersExporter } from '../servers/services/ServersExporter';
import { ServersImporter } from '../servers/services/ServersImporter';
import { csvToJson, jsonToCsv } from '../utils/helpers/csvjson';
import { LocalStorage } from '../utils/services/LocalStorage';
import { TagColorsStorage } from '../utils/services/TagColorsStorage';

const bottle = new Bottle();

export const { container } = bottle;

bottle.constant('window', window);
bottle.constant('console', console);
bottle.constant('fetch', window.fetch.bind(window));
bottle.service('HttpClient', FetchHttpClient, 'fetch');

bottle.constant('localStorage', window.localStorage);
bottle.service('Storage', LocalStorage, 'localStorage');
bottle.service('TagColorsStorage', TagColorsStorage, 'Storage');

bottle.constant('csvToJson', csvToJson);
bottle.constant('jsonToCsv', jsonToCsv);

bottle.serviceFactory('useTimeoutToggle', () => useTimeoutToggle);

bottle.serviceFactory('buildShlinkApiClient', buildShlinkApiClient, 'HttpClient');

// Components
bottle.factory('App', AppFactory);

bottle.serviceFactory('Home', () => Home);
bottle.decorator('Home', withoutSelectedServer);

bottle.factory('ShlinkWebComponentContainer', ShlinkWebComponentContainerFactory);

bottle.factory('ManageServers', ManageServersFactory);
bottle.decorator('ManageServers', withoutSelectedServer);

bottle.factory('CreateServer', CreateServerFactory);
bottle.decorator('CreateServer', withoutSelectedServer);

bottle.factory('ImportServersBtn', ImportServersBtnFactory);

// Services
bottle.service('ServersImporter', ServersImporter, 'csvToJson');
bottle.service('ServersExporter', ServersExporter, 'Storage', 'window', 'jsonToCsv');
