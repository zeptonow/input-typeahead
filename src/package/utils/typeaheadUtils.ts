import { RefObject } from "react";

export const clearTextAfterTrigger = (
  inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement>,
  triggerChar: string,
): void => {
  if (!inputRef.current) return;

  const input = inputRef.current;
  const value = input.value;
  const cursorPosition = input.selectionStart || 0;

  // Find the last occurrence of the trigger character before the cursor
  const searchStart = value.lastIndexOf(triggerChar, cursorPosition - 1);

  if (searchStart >= 0) {
    // Only clear the text from the trigger character up to the cursor
    const newValue = value.slice(0, searchStart) + triggerChar;
    input.value = newValue;

    // Set cursor position right after the trigger character
    const newCursorPosition = searchStart + triggerChar.length;
    input.setSelectionRange(newCursorPosition, newCursorPosition);
  }
};

export const getSearchText = (
  inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement>,
  triggerChar: string,
): { searchStart: number; currentSearch: string } | null => {
  if (!inputRef.current) return null;

  const input = inputRef.current;
  const value = input.value;
  const cursorPosition = input.selectionStart || 0;
  const searchStart = value.lastIndexOf(triggerChar, cursorPosition - 1);

  if (searchStart === -1) return null;

  return {
    searchStart,
    currentSearch: value.slice(searchStart + 1, cursorPosition),
  };
};
