import { useState, useEffect, useCallback } from 'react';
import { ZeptoTypeAheadOption } from '../types';

export const useTypeahead = (
    inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement>,
    options: ZeptoTypeAheadOption[],
    triggerChar: string,
    activateMode: 'once' | 'multiple',
    searchCallback?: (label: string, value: string) => boolean
) => {
    const [isActive, setIsActive] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [filteredOptions, setFilteredOptions] = useState<ZeptoTypeAheadOption[]>([]);
    const [currentOptions, setCurrentOptions] = useState<ZeptoTypeAheadOption[]>(options);
    const [hasActivated, setHasActivated] = useState(false);

    const filterOptions = useCallback((value: string) => {
        if (!value) return currentOptions;

        return currentOptions.filter(option => {
            if (searchCallback) {
                return searchCallback(option.label, value);
            }
            return option.label.toLowerCase().includes(value.toLowerCase());
        });
    }, [currentOptions, searchCallback]);

    useEffect(() => {
        if (!inputRef.current) return;
        const _inputRef = inputRef.current;

        const handleInput = (e: Event) => {
            const input = e.target as HTMLInputElement | HTMLTextAreaElement;
            const value = input.value;
            const cursorPosition = input.selectionStart || 0;

            if (activateMode === 'once') {
                if (!hasActivated && value.length === 1 && value[0] === triggerChar) {
                    setIsActive(true);
                    setSearchValue('');
                    setFilteredOptions(currentOptions);
                    setHasActivated(true);
                } else if (isActive) {
                    if (value.lastIndexOf(triggerChar, cursorPosition) === -1 || value.includes(' ')) {
                        setIsActive(false);
                    } else {
                        const searchStart = value.lastIndexOf(triggerChar, cursorPosition - 1) + 1;
                        const currentSearch = value.slice(searchStart, cursorPosition);
                        setSearchValue(currentSearch);
                        setFilteredOptions(filterOptions(currentSearch));
                    }
                }
            } else {
                const precedingChar = value[cursorPosition - 1];
                const precedingSpace = cursorPosition === 1 || value[cursorPosition - 2] === ' ';

                if (precedingChar === triggerChar && precedingSpace) {
                    setIsActive(true);
                    setSearchValue('');
                    setFilteredOptions(currentOptions);
                } else if (isActive) {
                    const searchStart = value.lastIndexOf(triggerChar, cursorPosition - 1) + 1;
                    const currentSearch = value.slice(searchStart, cursorPosition);
                    setSearchValue(currentSearch);
                    setFilteredOptions(filterOptions(currentSearch));
                }
            }
        };

        const handleKeyDown = (e: Event) => {
            const keyboardEvent = e as KeyboardEvent;
            if (keyboardEvent.key === 'Escape') {
                setIsActive(false);
                if (activateMode === 'once') {
                    setHasActivated(true);
                }
            }
        };

        inputRef.current.addEventListener('input', handleInput);
        inputRef.current.addEventListener('keydown', handleKeyDown);

        return () => {
            _inputRef?.removeEventListener('input', handleInput);
            _inputRef?.removeEventListener('keydown', handleKeyDown);
        };
    }, [inputRef, currentOptions, triggerChar, activateMode, filterOptions, hasActivated, isActive]);

    const setNestedOptions = (options: ZeptoTypeAheadOption[]) => {
        setCurrentOptions(options);
        setFilteredOptions(options);
    };

    return {
        isActive,
        searchValue,
        filteredOptions,
        setIsActive,
        setNestedOptions
    };
}; 