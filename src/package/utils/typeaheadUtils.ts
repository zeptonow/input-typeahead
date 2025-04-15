import { RefObject } from "react";

export const clearTextAfterTrigger = (
    inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement>,
    triggerChar: string
) => {
    if (!inputRef.current) return;

    const input = inputRef.current;
    const value = input.value;
    const cursorPosition = input.selectionStart || 0;
    const searchStart = value.lastIndexOf(triggerChar, cursorPosition - 1);

    if (searchStart !== -1) {
        // Keep only the trigger character
        input.value = triggerChar;
        input.setSelectionRange(1, 1);
    }
};

export const getSearchText = (
    inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement>,
    triggerChar: string
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