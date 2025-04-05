import { act, screen, waitFor } from '@testing-library/react';
import { AppUpdateBanner } from '../../src/common/AppUpdateBanner';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<AppUpdateBanner />', () => {
  const onClose = vi.fn();
  const forceUpdate = vi.fn();
  const setUp = async () => {
    const result = await act(
      () => renderWithEvents(<AppUpdateBanner isOpen onClose={onClose} forceUpdate={forceUpdate} />),
    );
    await waitFor(() => screen.getByRole('alert'));

    return result;
  };

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it('renders initial state', async () => {
    await setUp();

    expect(screen.getByRole('heading')).toHaveTextContent('This app has just been updated!');
    expect(screen.queryByText('Restarting...')).not.toBeInTheDocument();
    expect(screen.getByText('Restart now')).not.toHaveAttribute('disabled');
  });

  it('invokes toggle when alert is closed', async () => {
    const { user } = await setUp();

    expect(onClose).not.toHaveBeenCalled();
    await user.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalled();
  });

  it('triggers the update when clicking the button', async () => {
    const { user } = await setUp();

    expect(forceUpdate).not.toHaveBeenCalled();
    await user.click(screen.getByText(/^Restart now/));
    expect(forceUpdate).toHaveBeenCalled();
    expect(await screen.findByText('Restarting...')).toBeInTheDocument();
    expect(screen.queryByText(/^Restart now/)).not.toBeInTheDocument();
  });
});
