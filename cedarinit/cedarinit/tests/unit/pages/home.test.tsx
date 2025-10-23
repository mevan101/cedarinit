import { render, screen } from '@testing-library/react';
import Home from '../../../app/(marketing)/page';

describe('Home Page', () => {
  it('renders the hero section', () => {
    render(<Home />);
    const heroElement = screen.getByRole('heading', { name: /mission/i });
    expect(heroElement).toBeInTheDocument();
  });

  it('displays key performance indicators', () => {
    render(<Home />);
    const kpiElement = screen.getByText(/key performance indicators/i);
    expect(kpiElement).toBeInTheDocument();
  });

  it('renders values cards', () => {
    render(<Home />);
    const valuesElement = screen.getByText(/values/i);
    expect(valuesElement).toBeInTheDocument();
  });

  it('contains a call to action', () => {
    render(<Home />);
    const ctaElement = screen.getByRole('button', { name: /take action/i });
    expect(ctaElement).toBeInTheDocument();
  });
});