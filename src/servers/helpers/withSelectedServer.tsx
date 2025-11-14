import { Message } from '@shlinkio/shlink-frontend-kit';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import type { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { NoMenuLayout } from '../../common/NoMenuLayout';
import type { FCWithDeps } from '../../container/utils';
import { useDependencies } from '../../container/utils';
import type { SelectedServer } from '../data';
import { isNotFoundServer } from '../data';
import type { SelectServerOptions } from '../reducers/selectedServer';

export type WithSelectedServerProps = {
  selectServer: (options: SelectServerOptions) => void;
  selectedServer: SelectedServer;
};

export type WithSelectedServerPropsDeps = {
  ServerError: FC;
  buildShlinkApiClient: ShlinkApiClientBuilder;
};

export function withSelectedServer<T extends object>(
  WrappedComponent: FCWithDeps<WithSelectedServerProps & T, WithSelectedServerPropsDeps>,
) {
  const ComponentWrapper: FCWithDeps<WithSelectedServerProps & T, WithSelectedServerPropsDeps> = (props) => {
    const { ServerError, buildShlinkApiClient } = useDependencies(ComponentWrapper);
    const params = useParams<{ serverId: string }>();
    const { selectServer, selectedServer } = props;

    useEffect(() => {
      if (params.serverId) {
        selectServer({ serverId: params.serverId, buildShlinkApiClient });
      }
    }, [buildShlinkApiClient, params.serverId, selectServer]);

    if (!selectedServer) {
      return (
        <NoMenuLayout>
          <Message loading />
        </NoMenuLayout>
      );
    }

    if (isNotFoundServer(selectedServer)) {
      return <ServerError />;
    }

    return <WrappedComponent {...props} />;
  };
  return ComponentWrapper;
}
