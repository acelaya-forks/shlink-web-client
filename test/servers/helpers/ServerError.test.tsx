import { render, screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { MemoryRouter } from 'react-router';
import type { NonReachableServer, NotFoundServer, SelectedServer } from '../../../src/servers/data';
import { ServerErrorFactory } from '../../../src/servers/helpers/ServerError';
import { checkAccessibility } from '../../__helpers__/accessibility';

describe('<ServerError />', () => {
  const ServerError = ServerErrorFactory(fromPartial({ DeleteServerButton: () => null }));
  const setUp = (selectedServer: SelectedServer) => render(
    <MemoryRouter>
      <ServerError servers={{}} selectedServer={selectedServer} />
    </MemoryRouter>,
  );

  it.each([
    [fromPartial<NotFoundServer>({})],
    [fromPartial<NonReachableServer>({ id: 'abc123' })],
  ])('passes a11y checks', (selectedServer) => checkAccessibility(setUp(selectedServer)));

  it.each([
    [
      fromPartial<NotFoundServer>({}),
      {
        found: ['Could not find this Shlink server.'],
        notFound: [
          'Oops! Could not connect to this Shlink server.',
          'Make sure you have internet connection, and the server is properly configured and on-line.',
          /^Alternatively, if you think you may have miss-configured this server/,
        ],
      },
    ],
    [
      fromPartial<NonReachableServer>({ id: 'abc123' }),
      {
        found: [
          'Oops! Could not connect to this Shlink server.',
          'Make sure you have internet connection, and the server is properly configured and on-line.',
          /^Alternatively, if you think you may have miss-configured this server/,
        ],
        notFound: ['Could not find this Shlink server.'],
      },
    ],
  ])('renders expected information based on provided server type', (selectedServer, { found, notFound }) => {
    setUp(selectedServer);

    found.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
    notFound.forEach((text) => expect(screen.queryByText(text)).not.toBeInTheDocument());
  });
});
