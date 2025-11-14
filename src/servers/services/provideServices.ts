import type Bottle from 'bottlejs';
import { CreateServerFactory } from '../CreateServer';
import { ImportServersBtnFactory } from '../helpers/ImportServersBtn';
import { withoutSelectedServer } from '../helpers/withoutSelectedServer';
import { ManageServersFactory } from '../ManageServers';
import { ServersExporter } from './ServersExporter';
import { ServersImporter } from './ServersImporter';

export const provideServices = (bottle: Bottle) => {
  // Components
  bottle.factory('ManageServers', ManageServersFactory);
  bottle.decorator('ManageServers', withoutSelectedServer);

  bottle.factory('CreateServer', CreateServerFactory);
  bottle.decorator('CreateServer', withoutSelectedServer);

  bottle.factory('ImportServersBtn', ImportServersBtnFactory);

  // Services
  bottle.service('ServersImporter', ServersImporter, 'csvToJson');
  bottle.service('ServersExporter', ServersExporter, 'Storage', 'window', 'jsonToCsv');
};
