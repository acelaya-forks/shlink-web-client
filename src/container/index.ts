import Bottle from 'bottlejs';
import { provideServices as provideApiServices } from '../api/services/provideServices';
import { provideServices as provideAppServices } from '../app/services/provideServices';
import { provideServices as provideCommonServices } from '../common/services/provideServices';
import { provideServices as provideServersServices } from '../servers/services/provideServices';
import { provideServices as provideUtilsServices } from '../utils/services/provideServices';

const bottle = new Bottle();

export const { container } = bottle;

provideAppServices(bottle);
provideCommonServices(bottle);
provideApiServices(bottle);
provideServersServices(bottle);
provideUtilsServices(bottle);
