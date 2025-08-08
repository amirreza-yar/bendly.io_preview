"use client";
import { createContext, useContext } from 'react';
import useTapper from '@/hooks/canvas/useTapper';

const TapperingContext = createContext(null);

export const TapperingProvider = ({ children }) => {
  const context = useTapper();
  return (
    <TapperingContext.Provider value={context}>
      {children}
    </TapperingContext.Provider>
  );
};

export const useTapperingContext = () => useContext(TapperingContext);