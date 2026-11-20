'use client';

import { useState } from 'react';

export default function CopyColor({ value, name }: { value: string; name: string }) {
  const [status, setStatus] = useState('');
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus('Copied');
    } catch {
      setStatus('Select the hex above to copy');
    }
  }
  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${name} hex ${value}`}
        className="inline-flex min-h-[44px] items-center gap-2 rounded border border-current/40 px-3 text-xs font-medium transition hover:bg-black/10"
      >
        Copy hex <span aria-hidden="true">↗</span>
      </button>
      <p role="status" className="mt-1 min-h-4 text-xs">
        {status}
      </p>
    </div>
  );
}
