'use client';

import { useEffect, useState } from 'react';

/** Live clock + status bar at the very bottom of the viewport. */
export function StatusBar() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const fmt = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setTime(`${h}:${m}`);
    };
    fmt(); // immediate on mount
    const id = setInterval(fmt, 10_000); // refresh every 10 s
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="flex items-center justify-between px-4 py-1.5
                       border-t border-gray-700 text-xs text-gray-500
                       shrink-0">
      <span>
        By Shakil Ilham
        {time && (
          <>
            <span className="mx-2">|</span>
            {time}
          </>
        )}
        <span className="mx-2">|</span>
        Color theme
      </span>
      <span className="text-gray-600">:help for commands</span>
    </footer>
  );
}
