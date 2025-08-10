// providers/ResizingProvider.jsx
"use client";
import { createContext, useContext } from 'react';
import useLineResizing from '@/hooks/canvas/useLineResizing';

const ResizingContext = createContext(null);

export const ResizingProvider = ({ children }) => {
  const context = useLineResizing();
  return (
    <ResizingContext.Provider value={context}>
      {children}
    </ResizingContext.Provider>
  );
};

export const useResizingContext = () => useContext(ResizingContext);