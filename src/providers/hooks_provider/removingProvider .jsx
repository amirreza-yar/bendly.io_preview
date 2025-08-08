// providers/ResizingProvider.jsx
"use client";
import { createContext, useContext } from 'react';
import useRemoving from '@/hooks/canvas/useRemoving';

const RemovingContext = createContext(null);

export const RemovingProvider = ({ children }) => {
  const context = useRemoving();
  return (
    <RemovingContext.Provider value={context}>
      {children}
    </RemovingContext.Provider>
  );
};

export const useRemovingContext = () => useContext(RemovingContext);