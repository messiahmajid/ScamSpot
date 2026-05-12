import { render, screen } from '@testing-library/react';
import App from './App';

test('renders ScamSpot landing page', () => {
  render(<App />);
  expect(screen.getAllByText(/ScamSpot/i).length).toBeGreaterThan(0);
});
