import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { PropsWithChildren, ReactElement } from 'react';
import { Provider } from 'react-redux';
import type { ShlinkState } from '../../src/container/types';
import { setUpStore } from '../../src/store';

export const renderWithEvents = (element: ReactElement, options?: RenderOptions) => ({
  user: userEvent.setup(),
  ...render(element, options),
});

export type RenderOptionsWithState = Omit<RenderOptions, 'wrapper'> & {
  initialState?: Partial<ShlinkState>;
};

export const renderWithStore = (
  element: ReactElement,
  { initialState = {}, ...options }: RenderOptionsWithState = {},
) => {
  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={setUpStore(initialState)}>
      {children}
    </Provider>
  );
  return renderWithEvents(element, { ...options, wrapper: Wrapper });
};
