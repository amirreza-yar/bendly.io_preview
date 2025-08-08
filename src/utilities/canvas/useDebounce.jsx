// utils/useDebounce.js
import { useEffect, useRef } from "react";

/**
 * useDebouncedEffect calls the provided effect after the dependencies stabilize for `delay` ms.
 */
export function useDebouncedEffect(effect, deps, delay) {
  const effectRef = useRef();
  useEffect(() => {
    effectRef.current = effect;
  }, [effect]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (effectRef.current) effectRef.current();
    }, delay);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
}
