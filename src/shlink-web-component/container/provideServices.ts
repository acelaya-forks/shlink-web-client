import type Bottle from 'bottlejs';
import { Main } from '../Main';

export const provideServices = (bottle: Bottle) => {
  bottle.serviceFactory(
    'Main',
    Main,
    'TagsList',
    'ShortUrlsList',
    'CreateShortUrl',
    'ShortUrlVisits',
    'TagVisits',
    'DomainVisits',
    'OrphanVisits',
    'NonOrphanVisits',
    'Overview',
    'EditShortUrl',
    'ManageDomains',
  );
};
