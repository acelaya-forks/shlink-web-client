import { Message } from '@shlinkio/shlink-frontend-kit';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { NoMenuLayout } from '../../common/NoMenuLayout';
import { isNotFoundServer } from '../data';
import { useSelectedServer } from '../reducers/selectedServer';
import { ServerError } from './ServerError';

export function withSelectedServer<T extends object>(WrappedComponent: FC<T>) {
  const ComponentWrapper: FC<T> = (props) => {
    const params = useParams<{ serverId: string }>();
    const { selectServer, selectedServer } = useSelectedServer();

    useEffect(() => {
      if (params.serverId) {
        selectServer(params.serverId);
      }
    }, [params.serverId, selectServer]);

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
