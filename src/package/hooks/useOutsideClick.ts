import { useEffect, RefObject } from "react";

export const useOutsideClick = (
  refs: RefObject<HTMLElement | null>[],
  handler: (event: MouseEvent) => void,
  isActive: boolean,
) => {
  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside all provided refs
      const isOutside = refs.every(
        (ref) => ref.current && !ref.current.contains(event.target as Node),
      );

      if (isOutside) {
        handler(event);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [refs, handler, isActive]);
};
