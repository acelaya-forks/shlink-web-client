import { ShlinkWebSettings } from '@shlinkio/shlink-web-component/settings';
import type { FC } from 'react';
import { NoMenuLayout } from '../common/NoMenuLayout';
import { DEFAULT_SHORT_URLS_ORDERING, useSettings } from './reducers/settings';

export const Settings: FC = () => {
  const { settings, setSettings } = useSettings();

  return (
    <NoMenuLayout>
      <ShlinkWebSettings
        settings={settings}
        onUpdateSettings={setSettings}
        defaultShortUrlsListOrdering={DEFAULT_SHORT_URLS_ORDERING}
      />
    </NoMenuLayout>
  );
};
