import type { FC } from 'react';
import { useEffect } from 'react';
import { useSelectedServer } from '../reducers/selectedServer';

export function withoutSelectedServer<T extends object>(WrappedComponent: FC<T>) {
  return (props: T) => {
    const { resetSelectedServer } = useSelectedServer();
    useEffect(() => {
      resetSelectedServer();
    }, [resetSelectedServer]);

    return <WrappedComponent {...props} />;
  };
}
