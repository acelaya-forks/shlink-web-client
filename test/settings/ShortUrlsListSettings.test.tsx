import type { ShortUrlsListSettings as ShortUrlsSettings } from '@shlinkio/shlink-web-component';
import { screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import type { ShortUrlsOrder } from '../../shlink-web-component/src/short-urls/data';
import { ShortUrlsListSettings } from '../../src/settings/ShortUrlsListSettings';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<ShortUrlsListSettings />', () => {
  const setSettings = vi.fn();
  const setUp = (shortUrlsList?: ShortUrlsSettings) => renderWithEvents(
    <ShortUrlsListSettings settings={fromPartial({ shortUrlsList })} setShortUrlsListSettings={setSettings} />,
  );

  it.each([
    [undefined, 'Order by: Created at - DESC'],
    [{}, 'Order by: Created at - DESC'],
    [{ defaultOrdering: {} }, 'Order by...'],
    [{ defaultOrdering: { field: 'longUrl', dir: 'DESC' } as ShortUrlsOrder }, 'Order by: Long URL - DESC'],
    [{ defaultOrdering: { field: 'visits', dir: 'ASC' } as ShortUrlsOrder }, 'Order by: Visits - ASC'],
  ])('shows expected ordering', (shortUrlsList, expectedOrder) => {
    setUp(shortUrlsList);
    expect(screen.getByRole('button')).toHaveTextContent(expectedOrder);
  });

  it.each([
    ['Clear selection', undefined, undefined],
    ['Long URL', 'longUrl', 'ASC'],
    ['Visits', 'visits', 'ASC'],
    ['Title', 'title', 'ASC'],
  ])('invokes setSettings when ordering changes', async (name, field, dir) => {
    const { user } = setUp();

    expect(setSettings).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('menuitem', { name }));
    expect(setSettings).toHaveBeenCalledWith({ defaultOrdering: { field, dir } });
  });
});
