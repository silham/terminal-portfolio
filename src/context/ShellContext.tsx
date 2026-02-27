'use client';

import { createContext, useContext } from 'react';

interface ShellContextValue {
  openEmail: () => void;
  openHelp: () => void;
}

export const ShellContext = createContext<ShellContextValue>({
  openEmail: () => {},
  openHelp: () => {},
});

export const useShell = () => useContext(ShellContext);
