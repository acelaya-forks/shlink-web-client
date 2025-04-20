import { act, screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import type { ServerData } from '../../../src/servers/data';
import { DuplicatedServersModal } from '../../../src/servers/helpers/DuplicatedServersModal';
import { checkAccessibility } from '../../__helpers__/accessibility';
import { renderWithEvents } from '../../__helpers__/setUpTest';

describe('<DuplicatedServersModal />', () => {
  const onClose = vi.fn();
  const onConfirm = vi.fn();
  const setUp = (duplicatedServers: ServerData[] = []) => act(() => renderWithEvents(
    <DuplicatedServersModal open duplicatedServers={duplicatedServers} onClose={onClose} onConfirm={onConfirm} />,
  ));
  const mockServer = (data: Partial<ServerData> = {}) => fromPartial<ServerData>(data);

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it.each([
    [[], 0],
    [[mockServer()], 2],
    [[mockServer(), mockServer()], 2],
    [[mockServer(), mockServer(), mockServer()], 3],
    [[mockServer(), mockServer(), mockServer(), mockServer()], 4],
  ])('renders expected amount of items', async (duplicatedServers, expectedItems) => {
    await setUp(duplicatedServers);
    expect(screen.queryAllByRole('listitem')).toHaveLength(expectedItems);
  });

  it.each([
    [
      [mockServer()],
      {
        header: 'Duplicated server',
        firstParagraph: 'There is already a server with:',
        lastParagraph: 'Do you want to save this server?',
        discardBtn: 'Discard',
        confirmButton: 'Save duplicate',
      },
    ],
    [
      [mockServer(), mockServer()],
      {
        header: 'Duplicated servers',
        firstParagraph: 'The next servers already exist:',
        lastParagraph: 'Do you want to save duplicated servers?',
        discardBtn: 'Ignore duplicates',
        confirmButton: 'Save duplicates',
      },
    ],
  ])('renders expected texts based on amount of servers', async (duplicatedServers, assertions) => {
    await setUp(duplicatedServers);

    expect(screen.getByRole('heading')).toHaveTextContent(assertions.header);
    expect(screen.getByText(assertions.firstParagraph)).toBeInTheDocument();
    expect(screen.getByText(assertions.lastParagraph)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: assertions.discardBtn })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: assertions.confirmButton })).toBeInTheDocument();
  });

  it.each([
    [[]],
    [[mockServer({ url: 'url', apiKey: 'apiKey' })]],
    [[
      mockServer({ url: 'url_1', apiKey: 'apiKey_1' }),
      mockServer({ url: 'url_2', apiKey: 'apiKey_2' }),
    ]],
  ])('displays provided server data', async (duplicatedServers) => {
    await setUp(duplicatedServers);

    if (duplicatedServers.length === 0) {
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    } else if (duplicatedServers.length === 1) {
      const [firstItem, secondItem] = screen.getAllByRole('listitem');

      expect(firstItem).toHaveTextContent(`URL: ${duplicatedServers[0].url}`);
      expect(secondItem).toHaveTextContent(`API key: ${duplicatedServers[0].apiKey}`);
    } else {
      expect.assertions(duplicatedServers.length);
      screen.getAllByRole('listitem').forEach((item, index) => {
        const server = duplicatedServers[index];
        expect(item).toHaveTextContent(`${server.url} - ${server.apiKey}`);
      });
    }
  });

  it('invokes onClose when appropriate button is clicked', async () => {
    const { user } = await setUp();

    expect(onClose).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Discard' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('invokes onConfirm when appropriate button is clicked', async () => {
    const { user } = await setUp();

    expect(onConfirm).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Save duplicate' }));
    expect(onConfirm).toHaveBeenCalled();
  });
});
