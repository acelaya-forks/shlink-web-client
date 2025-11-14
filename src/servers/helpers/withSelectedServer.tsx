import { Message } from '@shlinkio/shlink-frontend-kit';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import type { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { NoMenuLayout } from '../../common/NoMenuLayout';
import type { FCWithDeps } from '../../container/utils';
import { useDependencies } from '../../container/utils';
import { isNotFoundServer } from '../data';
import { useSelectedServer } from '../reducers/selectedServer';
import { ServerError } from './ServerError';

export type WithSelectedServerPropsDeps = {
  buildShlinkApiClient: ShlinkApiClientBuilder;
};

export function withSelectedServer<T extends object>(
  WrappedComponent: FCWithDeps<T, WithSelectedServerPropsDeps>,
) {
  const ComponentWrapper: FCWithDeps<T, WithSelectedServerPropsDeps> = (props) => {
    const { buildShlinkApiClient } = useDependencies(ComponentWrapper);
    const params = useParams<{ serverId: string }>();
    const { selectServer, selectedServer } = useSelectedServer();

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
