import { Button, useParsedQuery } from '@shlinkio/shlink-frontend-kit';
import { NoMenuLayout } from '../common/NoMenuLayout';
import type { FCWithDeps } from '../container/utils';
import { componentFactory, useDependencies } from '../container/utils';
import { useGoBack } from '../utils/helpers/hooks';
import type { ServerData } from './data';
import { isServerWithId } from './data';
import { ServerForm } from './helpers/ServerForm';
import type { WithSelectedServerPropsDeps } from './helpers/withSelectedServer';
import { withSelectedServer } from './helpers/withSelectedServer';
import { useSelectedServer } from './reducers/selectedServer';

type EditServerProps = {
  editServer: (serverId: string, serverData: ServerData) => void;
};

const EditServer: FCWithDeps<EditServerProps, WithSelectedServerPropsDeps> = withSelectedServer(({ editServer }) => {
  const { buildShlinkApiClient } = useDependencies(EditServer);
  const { selectServer, selectedServer } = useSelectedServer();
  const goBack = useGoBack();
  const { reconnect } = useParsedQuery<{ reconnect?: 'true' }>();

  if (!isServerWithId(selectedServer)) {
    return null;
  }

  const handleSubmit = (serverData: ServerData) => {
    editServer(selectedServer.id, serverData);
    if (reconnect === 'true') {
      selectServer({ serverId: selectedServer.id, buildShlinkApiClient });
    }
    goBack();
  };

  return (
    <NoMenuLayout>
      <ServerForm
        title={<>Edit &quot;{selectedServer.name}&quot;</>}
        initialValues={selectedServer}
        onSubmit={handleSubmit}
      >
        <Button variant="secondary" onClick={goBack}>Cancel</Button>
        <Button type="submit">Save</Button>
      </ServerForm>
    </NoMenuLayout>
  );
});

export const EditServerFactory = componentFactory(EditServer, ['ServerError']);
