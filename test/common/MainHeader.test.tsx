import { screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { MainHeader } from '../../src/common/MainHeader';
import { ContainerProvider } from '../../src/container/context';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithStore } from '../__helpers__/setUpTest';

describe('<MainHeader />', () => {
  const setUp = (pathname = '') => {
    const history = createMemoryHistory();
    history.push(pathname);

    return renderWithStore(
      <Router location={history.location} navigator={history}>
        <ContainerProvider value={fromPartial({ buildShlinkApiClient: vi.fn() })}>
          <MainHeader />
        </ContainerProvider>
      </Router>,
    );
  };

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it('renders ServersDropdown', () => {
    setUp();
    expect(screen.getByRole('button', { name: 'Servers' })).toBeInTheDocument();
  });

  it.each([
    ['/foo', false],
    ['/bar', false],
    ['/settings', true],
    ['/settings/foo', true],
    ['/settings/bar', true],
  ])('sets link to settings as active only when current path is settings', (currentPath, isActive) => {
    setUp(currentPath);
    expect(screen.getByRole('menuitem', { name: /Settings$/ })).toHaveAttribute(
      'data-active', isActive ? 'true' : 'false',
    );
  });
});
