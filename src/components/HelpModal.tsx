'use client';

import { useEffect } from 'react';

interface HelpModalProps {
  onClose: () => void;
}

const BINDINGS: { keys: string; action: string }[] = [
  { keys: '1 – 5',       action: 'Jump to that tab' },
  { keys: '← / →',       action: 'Switch tabs (on list pages)' },
  { keys: '↑ / ↓',       action: 'Move up / down in list' },
  { keys: 'j / k',       action: 'Move down / up in list (vim)' },
  { keys: 'Enter',       action: 'Open selected item' },
  { keys: 'Esc',         action: 'Go back / close modal' },
  { keys: 'Q',           action: 'Close modal / go back' },
  { keys: ':help or ?',  action: 'Show this help' },
];

export function HelpModal({ onClose }: HelpModalProps) {
  // Q or Escape closes the modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative border border-gray-700 bg-black text-gray-300
                    w-full max-w-sm mx-4 p-5 text-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-200">Help</span>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-200 focus:outline-none cursor-pointer"
          >
            [Q] close
          </button>
        </div>

        {/* Page navigation section */}
        <p className="text-gray-400 mb-2">## Page navigation</p>
        <p className="text-gray-500 leading-relaxed mb-4">
          It is a web page, so you can still navigate using a mouse. But you
          can also use just a keyboard following the Accessibility standards —
          Tab, arrow keys and space/enter key.
          <br /><br />
          However, this site includes some additional ways to navigate.
        </p>

        {/* Hot keys section */}
        <p className="text-gray-400 mb-3">## Hot keys</p>
        <table className="w-full border-collapse">
          <tbody>
            {BINDINGS.map(({ keys, action }) => (
              <tr key={keys}>
                <td className="pr-6 py-0.5 text-gray-500 whitespace-nowrap align-top w-36">
                  {keys}
                </td>
                <td className="py-0.5 text-gray-400 leading-snug">{action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
