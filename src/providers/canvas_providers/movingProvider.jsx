// providers/ResizingProvider.jsx
"use client";
import { createContext, useContext } from 'react';
import useMoving from '@/hooks/canvas/useMoving';

const MovingContext = createContext(null);

export const MovingProvider = ({ children }) => {
  const context = useMoving();
  return (
    <MovingContext.Provider value={context}>
      {children}
    </MovingContext.Provider>
  );
};

export const useMovingContext = () => useContext(MovingContext);