'use client';

import { useState } from 'react';

export function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up to a mailing-list service
    setEmail('');
  };

  return (
    <div className="px-4 py-3 border-t border-gray-700 text-sm text-gray-400">
      <p className="text-gray-300 mb-1">Subscribe to my Newsletter</p>
      <form onSubmit={handleSubmit} className="flex items-center gap-0">
        <span className="text-gray-400 mr-2">Send weekly to:</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="_"
          aria-label="Newsletter email address"
          className="bg-transparent border-none outline-none text-gray-200 caret-gray-200
                     placeholder:text-gray-600 w-52"
        />
        <button
          type="submit"
          className="text-gray-200 border border-gray-600 px-2 py-0 ml-2
                     hover:bg-gray-200 hover:text-black transition-colors duration-100"
        >
          [SUBMIT]
        </button>
      </form>
    </div>
  );
}
