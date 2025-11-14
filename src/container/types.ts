import type { Settings } from '@shlinkio/shlink-web-component/settings';
import type { SelectedServer, ServersMap } from '../servers/data';

/** Deprecated Use RootState */
export type ShlinkState = {
  servers: ServersMap;
  selectedServer: SelectedServer;
  settings: Settings;
  appUpdated: boolean;
};

export type ConnectDecorator = (props: string[] | null, actions?: string[]) => any;

/** @deprecated */
export type GetState = () => ShlinkState;
