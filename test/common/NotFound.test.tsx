import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { NotFound } from '../../src/common/NotFound';
import { checkAccessibility } from '../__helpers__/accessibility';

describe('<NotFound />', () => {
  const setUp = (props = {}) => render(<MemoryRouter><NotFound {...props} /></MemoryRouter>);

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it('shows expected error title', () => {
    setUp();
    expect(screen.getByText('Oops! We could not find requested route.')).toBeInTheDocument();
  });

  it('shows expected error message', () => {
    setUp();
    expect(screen.getByText(
      'Use your browser\'s back button to navigate to the page you have previously come from, or just press this button.',
    )).toBeInTheDocument();
  });

  it.each([
    [{}, '/', 'Home'],
    [{ to: '/foo/bar', children: 'Hello' }, '/foo/bar', 'Hello'],
    [{ to: '/baz-bar', children: <>Foo</> }, '/baz-bar', 'Foo'],
  ])('shows expected link and text', (props, expectedLink, expectedText) => {
    setUp(props);
    const link = screen.getByRole('link');

    expect(link).toHaveAttribute('href', expectedLink);
    expect(link).toHaveTextContent(expectedText);
  });
});
