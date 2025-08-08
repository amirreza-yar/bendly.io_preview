// providers/ResizingProvider.jsx
"use client";
import { createContext, useContext, useRef } from "react";

const CancelChangesModalContext = createContext(null);

export const CancelChangesModalProvider = ({ children }) => {
  const onModalApply = useRef(() => {});
  const onModalDiscard = useRef(() => {});

  return (
    <CancelChangesModalContext.Provider
      value={{ onModalApply, onModalDiscard }}
    >
      {children}
    </CancelChangesModalContext.Provider>
  );
};

export const useCancelChangesModalContext = () =>
  useContext(CancelChangesModalContext);
