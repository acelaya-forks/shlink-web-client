import { useTimeoutToggle } from '@shlinkio/shlink-frontend-kit';
import { FetchHttpClient } from '@shlinkio/shlink-js-sdk/fetch';
import Bottle from 'bottlejs';
import { buildShlinkApiClient } from '../api/services/ShlinkApiClientBuilder';
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

bottle.service('ServersImporter', ServersImporter, 'csvToJson');
bottle.service('ServersExporter', ServersExporter, 'Storage', 'window', 'jsonToCsv');
