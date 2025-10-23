import { render, screen } from '@testing-library/react';
import TeamPage from '../../../app/(marketing)/team/page';

describe('Team Page', () => {
  it('renders the team page correctly', () => {
    render(<TeamPage />);

    // Check if the mission statement is present
    expect(screen.getByText(/mission/i)).toBeInTheDocument();

    // Check if team members are displayed
    expect(screen.getByText(/founder/i)).toBeInTheDocument();
    expect(screen.getByText(/co-founder/i)).toBeInTheDocument();
    expect(screen.getByText(/core team/i)).toBeInTheDocument();
    expect(screen.getByText(/advisers/i)).toBeInTheDocument();
  });
});