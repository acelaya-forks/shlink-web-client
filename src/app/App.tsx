import { changeThemeInMarkup, getSystemPreferredTheme } from '@shlinkio/shlink-frontend-kit';
import type { HttpClient } from '@shlinkio/shlink-js-sdk';
import type { Settings as AppSettings } from '@shlinkio/shlink-web-component/settings';
import { clsx } from 'clsx';
import type { FC } from 'react';
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import { AppUpdateBanner } from '../common/AppUpdateBanner';
import { MainHeader } from '../common/MainHeader';
import { NotFound } from '../common/NotFound';
import { ShlinkVersionsContainer } from '../common/ShlinkVersionsContainer';
import type { FCWithDeps } from '../container/utils';
import { componentFactory, useDependencies } from '../container/utils';
import { EditServer } from '../servers/EditServer';
import { useLoadRemoteServers } from '../servers/reducers/remoteServers';
import { Settings } from '../settings/Settings';
import { forceUpdate } from '../utils/helpers/sw';

export type AppProps = {
  settings: AppSettings;
  resetAppUpdate: () => void;
  appUpdated: boolean;
};

type AppDeps = {
  Home: FC;
  ShlinkWebComponentContainer: FC;
  CreateServer: FC;
  ManageServers: FC;
  HttpClient: HttpClient;
};

const App: FCWithDeps<AppProps, AppDeps> = ({ settings, appUpdated, resetAppUpdate }) => {
  const {
    Home,
    ShlinkWebComponentContainer,
    CreateServer,
    ManageServers,
    HttpClient: httpClient,
  } = useDependencies(App);

  useLoadRemoteServers(httpClient);

  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    changeThemeInMarkup(settings.ui?.theme ?? getSystemPreferredTheme());
  }, [settings.ui?.theme]);

  return (
    <div className="h-full">
      <>
        <MainHeader />

        <div className="h-full pt-(--header-height)">
          <div
            data-testid="shlink-wrapper"
            className={clsx(
              'min-h-full pb-[calc(var(--footer-height)+var(--footer-margin))] -mb-[calc(var(--footer-height)+var(--footer-margin))]',
              { 'flex items-center pt-4': isHome },
            )}
          >
            <Routes>
              <Route index element={<Home />} />
              <Route path="/settings">
                {['', '*'].map((path) => <Route key={path} path={path} element={<Settings />} />)}
              </Route>
              <Route path="/manage-servers" element={<ManageServers />} />
              <Route path="/server/create" element={<CreateServer />} />
              <Route path="/server/:serverId/edit" element={<EditServer />} />
              <Route path="/server/:serverId">
                {['', '*'].map((path) => <Route key={path} path={path} element={<ShlinkWebComponentContainer />} />)}
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>

          <div className="h-(--footer-height) mt-(--footer-margin) md:px-4">
            <ShlinkVersionsContainer />
          </div>
        </div>
      </>

      <AppUpdateBanner isOpen={appUpdated} onClose={resetAppUpdate} forceUpdate={forceUpdate} />
    </div>
  );
};

export const AppFactory = componentFactory(App, [
  'Home',
  'ShlinkWebComponentContainer',
  'CreateServer',
  'ManageServers',
  'HttpClient',
]);
