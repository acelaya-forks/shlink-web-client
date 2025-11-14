import type { TagColorsStorage } from '@shlinkio/shlink-web-component';
import {
  ShlinkSidebarToggleButton,
  ShlinkSidebarVisibilityProvider,
  ShlinkWebComponent,
} from '@shlinkio/shlink-web-component';
import type { Settings } from '@shlinkio/shlink-web-component/settings';
import { memo } from 'react';
import type { FCWithDeps } from '../container/utils';
import { componentFactory, useDependencies } from '../container/utils';
import { isReachableServer } from '../servers/data';
import type { WithSelectedServerPropsDeps } from '../servers/helpers/withSelectedServer';
import { withSelectedServer } from '../servers/helpers/withSelectedServer';
import { useSelectedServer } from '../servers/reducers/selectedServer';
import { NotFound } from './NotFound';

type ShlinkWebComponentContainerProps = {
  settings: Settings;
};

type ShlinkWebComponentContainerDeps = WithSelectedServerPropsDeps & {
  TagColorsStorage: TagColorsStorage,
};

const ShlinkWebComponentContainer: FCWithDeps<
  ShlinkWebComponentContainerProps,
  ShlinkWebComponentContainerDeps
// FIXME Using `memo` here to solve a flickering effect in charts.
//       memo is probably not the right solution. The root cause is the withSelectedServer HOC, but I couldn't fix the
//       extra rendering there.
//       This should be revisited at some point.
> = withSelectedServer(memo(({ settings }) => {
  const {
    buildShlinkApiClient,
    TagColorsStorage: tagColorsStorage,
    ServerError,
  } = useDependencies(ShlinkWebComponentContainer);
  const { selectedServer } = useSelectedServer();

  if (!isReachableServer(selectedServer)) {
    return <ServerError />;
  }

  const routesPrefix = `/server/${selectedServer.id}`;
  return (
    <ShlinkSidebarVisibilityProvider>
      <ShlinkSidebarToggleButton className="fixed top-3.5 left-3 z-901" />
      <ShlinkWebComponent
        serverVersion={selectedServer.version}
        apiClient={buildShlinkApiClient(selectedServer)}
        settings={settings}
        routesPrefix={routesPrefix}
        tagColorsStorage={tagColorsStorage}
        createNotFound={(nonPrefixedHomePath: string) => (
          <NotFound to={`${routesPrefix}${nonPrefixedHomePath}`}>List short URLs</NotFound>
        )}
        autoSidebarToggle={false}
      />
    </ShlinkSidebarVisibilityProvider>
  );
}));

export const ShlinkWebComponentContainerFactory = componentFactory(ShlinkWebComponentContainer, [
  'buildShlinkApiClient',
  'TagColorsStorage',
  'ServerError',
]);
