import type Bottle from 'bottlejs';
import { AppFactory } from '../App';

export const provideServices = (bottle: Bottle) => {
  // Components
  bottle.factory('App', AppFactory);
};
