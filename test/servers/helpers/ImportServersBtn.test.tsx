import { screen, waitFor } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import type { ServerData, ServersMap, ServerWithId } from '../../../src/servers/data';
import type {
  ImportServersBtnProps } from '../../../src/servers/helpers/ImportServersBtn';
import { ImportServersBtnFactory } from '../../../src/servers/helpers/ImportServersBtn';
import type { ServersImporter } from '../../../src/servers/services/ServersImporter';
import { checkAccessibility } from '../../__helpers__/accessibility';
import { renderWithEvents } from '../../__helpers__/setUpTest';

describe('<ImportServersBtn />', () => {
  const csvFile = new File([''], 'servers.csv', { type: 'text/csv' });
  const onImportMock = vi.fn();
  const createServersMock = vi.fn();
  const importServersFromFile = vi.fn().mockResolvedValue([]);
  const serversImporterMock = fromPartial<ServersImporter>({ importServersFromFile });
  const ImportServersBtn = ImportServersBtnFactory(fromPartial({ ServersImporter: serversImporterMock }));
  const setUp = (props: Partial<ImportServersBtnProps> = {}, servers: ServersMap = {}) => renderWithEvents(
    <ImportServersBtn
      servers={servers}
      {...props}
      createServers={createServersMock}
      onImport={onImportMock}
    />,
  );

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it('shows tooltip on button hover', async () => {
    const { user } = setUp();

    expect(screen.queryByText(/^You can create servers by importing a CSV file/)).not.toBeInTheDocument();
    await user.hover(screen.getByRole('button'));
    await waitFor(
      () => expect(screen.getByText(/^You can create servers by importing a CSV file/)).toBeInTheDocument(),
    );
  });

  it.each([
    [undefined, ''],
    ['foo', 'foo'],
    ['bar', 'bar'],
  ])('allows a class name to be provided', (providedClassName, expectedClassName) => {
    setUp({ className: providedClassName });
    expect(screen.getByRole('button')).toHaveAttribute('class', expect.stringContaining(expectedClassName));
  });

  it.each([
    [undefined, 'Import from file'],
    ['foo', 'foo'],
    ['bar', 'bar'],
  ])('has expected text', (children, expectedText) => {
    setUp({ children });
    expect(screen.getByRole('button')).toHaveTextContent(expectedText);
  });

  it('imports servers when file input changes', async () => {
    const { user } = setUp();

    const input = screen.getByTestId('csv-file-input');
    await user.upload(input, csvFile);

    expect(importServersFromFile).toHaveBeenCalledTimes(1);
    expect(createServersMock).toHaveBeenCalledTimes(1);
  });

  it.each([
    { btnName: 'Save duplicate', savesDuplicatedServers: true },
    { btnName: 'Discard', savesDuplicatedServers: false },
  ])('creates duplicated servers depending on selected option in modal', async ({ btnName, savesDuplicatedServers }) => {
    const existingServerData: ServerData = {
      name: 'existingServer',
      url: 'http://s.test/existingUrl',
      apiKey: 'existingApiKey',
    };
    const existingServer: ServerWithId = {
      ...existingServerData,
      id: 'existingserver-s.test',
    };
    const newServer: ServerData = { name: 'newServer', url: 'http://s.test/newUrl', apiKey: 'newApiKey' };
    const { user } = setUp({}, { [existingServer.id]: existingServer });

    importServersFromFile.mockResolvedValue([existingServer, newServer]);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.upload(screen.getByTestId('csv-file-input'), csvFile);

    // Once the file is uploaded, non-duplicated servers are immediately created
    expect(createServersMock).toHaveBeenCalledExactlyOnceWith([expect.objectContaining(newServer)]);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: btnName }));

    // If duplicated servers are saved, there's one extra call
    if (savesDuplicatedServers) {
      expect(createServersMock).toHaveBeenLastCalledWith([expect.objectContaining(existingServerData)]);
    }

    // On import is called only once, no matter what
    expect(onImportMock).toHaveBeenCalledOnce();
    expect(createServersMock).toHaveBeenCalledTimes(savesDuplicatedServers ? 2 : 1);
  });
});
