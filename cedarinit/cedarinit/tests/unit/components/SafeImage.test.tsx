import { render, screen } from '@testing-library/react';
import SafeImage from '../../../components/SafeImage';

describe('SafeImage', () => {
  const validSrc = 'https://cdn.cedar-initiative.org/image.jpg';
  const invalidSrc = 'https://example.com/image.jpg';

  it('renders an image with a valid src', () => {
    render(<SafeImage src={validSrc} alt="Valid Image" />);
    const img = screen.getByAltText('Valid Image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', validSrc);
  });

  it('does not render an image with an invalid src', () => {
    render(<SafeImage src={invalidSrc} alt="Invalid Image" />);
    const img = screen.queryByAltText('Invalid Image');
    expect(img).not.toBeInTheDocument();
  });

  it('renders a fallback when the image fails to load', () => {
    render(<SafeImage src={invalidSrc} alt="Fallback Image" />);
    const fallback = screen.getByText('Image failed to load');
    expect(fallback).toBeInTheDocument();
  });
});