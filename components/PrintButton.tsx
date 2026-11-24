'use client';

import Icon from './Icon';

export default function PrintButton({ label = 'Save as PDF' }: { label?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="btn-glass">
      <Icon name="download" className="h-4 w-4" /> {label}
    </button>
  );
}
