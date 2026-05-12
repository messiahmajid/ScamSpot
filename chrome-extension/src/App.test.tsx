import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders ScamSpot extension popup', () => {
  render(<App />);
  expect(screen.getAllByText(/ScamSpot/i).length).toBeGreaterThan(0);
});
