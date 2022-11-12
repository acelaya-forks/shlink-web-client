import Bottle from 'bottlejs';
import { prop } from 'ramda';
import { MapModal } from '../helpers/MapModal';
import { createNewVisits } from '../reducers/visitCreation';
import { ShortUrlVisits } from '../ShortUrlVisits';
import { TagVisits } from '../TagVisits';
import { OrphanVisits } from '../OrphanVisits';
import { NonOrphanVisits } from '../NonOrphanVisits';
import { cancelGetShortUrlVisits, getShortUrlVisits } from '../reducers/shortUrlVisits';
import { cancelGetTagVisits, getTagVisits } from '../reducers/tagVisits';
import { getDomainVisits, domainVisitsReducerCreator } from '../reducers/domainVisits';
import { cancelGetOrphanVisits, getOrphanVisits } from '../reducers/orphanVisits';
import { getNonOrphanVisits, nonOrphanVisitsReducerCreator } from '../reducers/nonOrphanVisits';
import { ConnectDecorator } from '../../container/types';
import { loadVisitsOverview, visitsOverviewReducerCreator } from '../reducers/visitsOverview';
import * as visitsParser from './VisitsParser';
import { DomainVisits } from '../DomainVisits';

const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  // Components
  bottle.serviceFactory('MapModal', () => MapModal);

  bottle.serviceFactory('ShortUrlVisits', ShortUrlVisits, 'ReportExporter');
  bottle.decorator('ShortUrlVisits', connect(
    ['shortUrlVisits', 'shortUrlDetail', 'mercureInfo', 'settings', 'selectedServer'],
    ['getShortUrlVisits', 'getShortUrlDetail', 'cancelGetShortUrlVisits', 'createNewVisits', 'loadMercureInfo'],
  ));

  bottle.serviceFactory('TagVisits', TagVisits, 'ColorGenerator', 'ReportExporter');
  bottle.decorator('TagVisits', connect(
    ['tagVisits', 'mercureInfo', 'settings', 'selectedServer'],
    ['getTagVisits', 'cancelGetTagVisits', 'createNewVisits', 'loadMercureInfo'],
  ));

  bottle.serviceFactory('DomainVisits', DomainVisits, 'ReportExporter');
  bottle.decorator('DomainVisits', connect(
    ['domainVisits', 'mercureInfo', 'settings', 'selectedServer'],
    ['getDomainVisits', 'cancelGetDomainVisits', 'createNewVisits', 'loadMercureInfo'],
  ));

  bottle.serviceFactory('OrphanVisits', OrphanVisits, 'ReportExporter');
  bottle.decorator('OrphanVisits', connect(
    ['orphanVisits', 'mercureInfo', 'settings', 'selectedServer'],
    ['getOrphanVisits', 'cancelGetOrphanVisits', 'createNewVisits', 'loadMercureInfo'],
  ));

  bottle.serviceFactory('NonOrphanVisits', NonOrphanVisits, 'ReportExporter');
  bottle.decorator('NonOrphanVisits', connect(
    ['nonOrphanVisits', 'mercureInfo', 'settings', 'selectedServer'],
    ['getNonOrphanVisits', 'cancelGetNonOrphanVisits', 'createNewVisits', 'loadMercureInfo'],
  ));

  // Services
  bottle.serviceFactory('VisitsParser', () => visitsParser);

  // Actions
  bottle.serviceFactory('getShortUrlVisits', getShortUrlVisits, 'buildShlinkApiClient');
  bottle.serviceFactory('cancelGetShortUrlVisits', () => cancelGetShortUrlVisits);

  bottle.serviceFactory('getTagVisits', getTagVisits, 'buildShlinkApiClient');
  bottle.serviceFactory('cancelGetTagVisits', () => cancelGetTagVisits);

  bottle.serviceFactory('getDomainVisitsCreator', getDomainVisits, 'buildShlinkApiClient');
  bottle.serviceFactory('getDomainVisits', prop('asyncThunk'), 'getDomainVisitsCreator');
  bottle.serviceFactory('cancelGetDomainVisits', prop('cancelGetDomainVisits'), 'domainVisitsReducerCreator');

  bottle.serviceFactory('getOrphanVisits', getOrphanVisits, 'buildShlinkApiClient');
  bottle.serviceFactory('cancelGetOrphanVisits', () => cancelGetOrphanVisits);

  bottle.serviceFactory('getNonOrphanVisitsCreator', getNonOrphanVisits, 'buildShlinkApiClient');
  bottle.serviceFactory('getNonOrphanVisits', prop('asyncThunk'), 'getNonOrphanVisitsCreator');
  bottle.serviceFactory('cancelGetNonOrphanVisits', prop('cancelGetNonOrphanVisits'), 'nonOrphanVisitsReducerCreator');

  bottle.serviceFactory('createNewVisits', () => createNewVisits);
  bottle.serviceFactory('loadVisitsOverview', loadVisitsOverview, 'buildShlinkApiClient');

  // Reducers
  bottle.serviceFactory('visitsOverviewReducerCreator', visitsOverviewReducerCreator, 'loadVisitsOverview');
  bottle.serviceFactory('visitsOverviewReducer', prop('reducer'), 'visitsOverviewReducerCreator');

  bottle.serviceFactory('domainVisitsReducerCreator', domainVisitsReducerCreator, 'getDomainVisitsCreator');
  bottle.serviceFactory('domainVisitsReducer', prop('reducer'), 'domainVisitsReducerCreator');

  bottle.serviceFactory('nonOrphanVisitsReducerCreator', nonOrphanVisitsReducerCreator, 'getNonOrphanVisitsCreator');
  bottle.serviceFactory('nonOrphanVisitsReducer', prop('reducer'), 'nonOrphanVisitsReducerCreator');
};

export default provideServices;
