import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the YouTube-style home feed', async () => {
  render(<App />);
  expect(screen.getByLabelText(/search$/i)).toBeInTheDocument();
  expect(await screen.findByText(/jawed/i)).toBeInTheDocument();
  expect(screen.getByText(/Recommended/i)).toBeInTheDocument();
});
