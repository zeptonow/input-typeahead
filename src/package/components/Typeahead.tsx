import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  ZeptoTypeAhead,
  ZeptoTypeAheadOption,
  ZeptoTypeAheadWidgetState,
} from "../types";
import { useOutsideClick } from "../hooks/useOutsideClick";
import ArrowRounded from "../icons/arrow-rounded";
import { clearTextAfterTrigger, getSearchText } from "../utils/typeaheadUtils";
import {
  getCaretCoordinates,
  updatePosition as updatePositionUtil,
} from "../utils/positionUtils";
import {
  defaultContainerStyles,
  defaultOptionStyles,
  defaultValueStyles,
  defaultActiveOptionStyle,
} from "../styles/typeaheadStyles";
import TypeaheadHeader from "./TypeaheadHeader";
import ChevronLeft from "../icons/chevron-left";

interface TypeaheadProps extends Omit<ZeptoTypeAhead, "onWidgetStateChange"> {
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
  onWidgetStateChange?: (state: ZeptoTypeAheadWidgetState) => void;
}

export const Typeahead: React.FC<TypeaheadProps> = ({
  options,
  triggerChar = "/",
  position = "bottom",
  activateMode = "multiple",
  maxVisibleOptions = 5,
  typeAheadContainerStyles,
  typeAheadOptionStyles,
  typeAheadActiveOptionStyle,
  typeAheadOptionValueStyles,
  onSelect,
  searchCallback,
  renderOption,
  renderHeader,
  inputRef,
  onWidgetStateChange,
}) => {
  // Core state management - formerly in useTypeahead hook
  const [isActive, setIsActive] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<
    ZeptoTypeAheadOption[]
  >([]);
  const [currentOptions, setCurrentOptions] =
    useState<ZeptoTypeAheadOption[]>(options);

  // Component specific state
  const [activeIndex, setActiveIndex] = useState(0);
  const [nestedPath, setNestedPath] = useState<ZeptoTypeAheadOption[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement | null>(null);

  // Refs map to store references to option elements
  const optionRefsMapRef = useRef<Map<number, HTMLDivElement>>(new Map());

  // Track whether keyboard navigation is active to prevent mouse hover conflicts
  const isKeyboardNavActive = useRef(false);

  // Clear refs map when filtered options change
  useEffect(() => {
    optionRefsMapRef.current.clear();
  }, [filteredOptions]);

  // Update currentOptions when options prop changes
  useEffect(() => {
    if (nestedPath.length === 0) {
      setCurrentOptions(options);
    }
  }, [options, nestedPath.length]);

  // Get caret coordinates using a more reliable method
  const getCaretCoords = useCallback(() => {
    return getCaretCoordinates(inputRef);
  }, [inputRef]);

  const updatePosition = useCallback(() => {
    updatePositionUtil({
      position,
      maxVisibleOptions,
      currentOptionsLength: currentOptions.length,
      containerRef,
      inputRef,
      getCaretCoordinates: getCaretCoords,
    });
  }, [
    position,
    maxVisibleOptions,
    currentOptions.length,
    containerRef,
    inputRef,
    getCaretCoords,
  ]);

  const resetTypeahead = useCallback(
    (preserveNesting = false) => {
      setIsActive(false);
      setActiveIndex(0);

      // Only reset nested path if not preserving nesting
      if (!preserveNesting) {
        setNestedPath([]);
        setCurrentOptions(options);
      }

      setFilteredOptions([]);
      // Reset keyboard navigation state
      isKeyboardNavActive.current = false;
    },
    [options]
  );

  const filterOptions = useCallback(
    (searchQuery: string, optionsToFilter: ZeptoTypeAheadOption[]) => {
      // If search is empty, return all options
      if (!searchQuery) return optionsToFilter;

      // Apply the filtering logic consistently
      return optionsToFilter.filter((option) => {
        // Use custom search callback if provided
        if (searchCallback) {
          return searchCallback(option.label, searchQuery);
        }

        // Otherwise compare with both label and value
        const labelMatch = option.label
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const valueMatch = option.value
          ? option.value.toLowerCase().includes(searchQuery.toLowerCase())
          : false;

        return labelMatch || valueMatch;
      });
    },
    [searchCallback]
  );

  const handleSearchInput = useCallback(
    (searchInfo: { searchStart: number; currentSearch: string }) => {
      if (!inputRef.current) return false; // Return false if unable to process

      const input = inputRef.current;
      const { searchStart, currentSearch } = searchInfo;

      // Check if the trigger character is standalone (preceded by space or start of line)
      const isStandaloneTrigger =
        searchStart === 0 ||
        (searchStart > 0 && /\s/.test(input.value.charAt(searchStart - 1)));

      if (!isStandaloneTrigger) {
        return false;
      }

      // For single mode, only allow the typeahead if trigger is the first non-whitespace character
      if (activateMode === "single") {
        const textBeforeTrigger = input.value.substring(0, searchStart).trim();
        if (textBeforeTrigger.length > 0) {
          return false;
        }
      }

      // Check if there's a space after the trigger character, if so close the typeahead
      if (currentSearch.includes(" ")) {
        return false;
      }

      // Filter options based on current path and search text
      let newFilteredOptions: ZeptoTypeAheadOption[] = [];

      if (nestedPath.length > 0) {
        // Get the options at the current nested level
        const currentNestedOptions =
          nestedPath[nestedPath.length - 1].children || [];

        // Apply filtering to the current nested level
        if (currentSearch === "") {
          // If search is empty (after backspacing), show all options at current level
          newFilteredOptions = currentNestedOptions;
        } else {
          // Filter based on search text
          newFilteredOptions = filterOptions(
            currentSearch,
            currentNestedOptions
          );
        }
      } else {
        // Not in nested mode, filter the top-level options
        if (currentSearch === "") {
          newFilteredOptions = options;
        } else {
          newFilteredOptions = filterOptions(currentSearch, options);
        }
      }

      // Update filtered options
      setFilteredOptions(newFilteredOptions);

      // Always return true for nested searches to keep the widget visible and retain the current level
      // This ensures we never reset back to level 1 during active searching
      return nestedPath.length > 0 || newFilteredOptions.length > 0;
    },
    [filterOptions, inputRef, nestedPath, options, activateMode]
  );

  const handleSelect = useCallback(
    (option: ZeptoTypeAheadOption) => {
      if (option.children && option.children.length > 0) {
        setNestedPath((prevPath) => [...prevPath, option]);
        setCurrentOptions(option.children);
        setFilteredOptions(option.children);
        setActiveIndex(0);
        clearTextAfterTrigger(inputRef, triggerChar);
      } else {
        if (inputRef.current) {
          const input = inputRef.current;
          const value = input.value;
          const cursorPosition = input.selectionStart || 0;
          const searchStart = value.lastIndexOf(
            triggerChar,
            cursorPosition - 1
          );

          if (searchStart >= 0) {
            // Replace only the trigger character and search text with the selected value
            const newValue =
              value.slice(0, searchStart) +
              (option.value || option.label) +
              value.slice(cursorPosition);
            input.value = newValue;

            // Set cursor position after the inserted value
            const newCursorPosition =
              searchStart + (option.value || option.label).length;
            input.setSelectionRange(newCursorPosition, newCursorPosition);
          }
        }
        onSelect?.(option);
        resetTypeahead();
      }
    },
    [inputRef, onSelect, resetTypeahead, triggerChar]
  );

  const handleBack = useCallback(() => {
    if (nestedPath.length > 0) {
      const newPath = [...nestedPath];
      newPath.pop();

      if (newPath.length === 0) {
        setNestedPath([]);
        setCurrentOptions(options);
        setFilteredOptions(options);
      } else {
        setNestedPath(newPath);
        const parentChildren = newPath[newPath.length - 1].children || [];
        setCurrentOptions(parentChildren);
        setFilteredOptions(parentChildren);
      }
      setActiveIndex(0);
      updatePosition();
      clearTextAfterTrigger(inputRef, triggerChar);
    }
  }, [nestedPath, options, updatePosition, inputRef, triggerChar]);

  // Use the outside click hook
  useOutsideClick([containerRef, inputRef], () => resetTypeahead(), isActive);

  const handleNestedNavigation = useCallback(
    (option: ZeptoTypeAheadOption) => {
      if (option.children && option.children.length > 0) {
        setNestedPath((prevPath) => [...prevPath, option]);
        setCurrentOptions(option.children);
        setFilteredOptions(option.children);
        setActiveIndex(0);
        updatePosition();
        clearTextAfterTrigger(inputRef, triggerChar);
      } else {
        handleSelect(option);
      }
    },
    [handleSelect, updatePosition, inputRef, triggerChar]
  );

  const handleClose = useCallback(() => {
    resetTypeahead();
  }, [resetTypeahead]);

  // Helper function to scroll the active option into view using the refs map
  const scrollActiveOptionIntoView = useCallback((index: number) => {
    const optionElement = optionRefsMapRef.current.get(index);

    if (optionElement && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const optionRect = optionElement.getBoundingClientRect();

      if (optionRect.bottom > containerRect.bottom) {
        // Option is below view, scroll down
        optionElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      } else if (optionRect.top < containerRect.top) {
        // Option is above view, scroll up
        optionElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, []);

  // Create portal container on mount
  useEffect(() => {
    if (!portalRef.current) {
      portalRef.current = document.createElement("div");
      document.body.appendChild(portalRef.current);
    }
    return () => {
      if (portalRef.current) {
        document.body.removeChild(portalRef.current);
        portalRef.current = null;
      }
    };
  }, []);

  // Handle input changes and filtering
  useEffect(() => {
    if (!inputRef.current) return;

    const input = inputRef.current;

    const handleInput = () => {
      const searchInfo = getSearchText(inputRef, triggerChar);

      // If we can't get search info, hide the widget
      if (!searchInfo) {
        if (isActive) {
          resetTypeahead();
        }
        return;
      }

      // Process the search
      const shouldShowWidget = handleSearchInput(searchInfo);

      // If we should show widget or the search is empty, ensure the widget is visible
      if (shouldShowWidget || searchInfo.currentSearch === "") {
        if (!isActive) {
          // If widget was hidden, show it again
          setIsActive(true);

          // We need to wait for the state to update before positioning
          setTimeout(() => {
            updatePosition();
          }, 0);
        } else {
          // Widget is already visible, just update position
          updatePosition();
        }
      } else if (
        isActive &&
        searchInfo.currentSearch !== "" &&
        nestedPath.length === 0
      ) {
        // Hide widget only if:
        // 1. Widget is active
        // 2. We have a non-empty query with no matches
        // 3. We are NOT in a nested level (this is the key change)
        resetTypeahead();
      }
    };

    // Only attach the listener when we need it
    if (isActive) {
      input.addEventListener("input", handleInput);
      return () => input.removeEventListener("input", handleInput);
    } else {
      // This creates a more responsive experience by constantly checking for matches
      // even when the widget is hidden
      const checkForMatches = () => {
        const searchInfo = getSearchText(inputRef, triggerChar);
        if (searchInfo) {
          const hasMatches = handleSearchInput(searchInfo);
          if (hasMatches) {
            setIsActive(true);
            setTimeout(() => updatePosition(), 0);
          }
        }
      };

      input.addEventListener("input", checkForMatches);
      return () => input.removeEventListener("input", checkForMatches);
    }
  }, [
    isActive,
    inputRef,
    triggerChar,
    updatePosition,
    resetTypeahead,
    handleSearchInput,
    nestedPath.length,
  ]);

  // Track cursor movement and trigger character
  useEffect(() => {
    if (!inputRef.current) return;

    const input = inputRef.current;
    const handleKeyDown = (e: Event) => {
      const keyEvent = e as KeyboardEvent;
      if (keyEvent.key === triggerChar) {
        // Check if trigger character would be standalone (preceded by space or start of line)
        const value = input.value;
        const cursorPosition = input.selectionStart || 0;

        const isStandaloneTrigger =
          cursorPosition === 0 ||
          (cursorPosition > 0 && /\s/.test(value.charAt(cursorPosition - 1)));

        if (!isStandaloneTrigger) {
          return;
        }

        // For single mode, only activate if this would be the first non-whitespace character
        if (activateMode === "single") {
          const textBeforeCursor = value.substring(0, cursorPosition).trim();
          if (textBeforeCursor.length > 0) {
            return;
          }
        }

        // Activate typeahead when trigger character is typed
        setIsActive(true);
        setCurrentOptions(options);
        setFilteredOptions(options);

        // We need to wait for the character to be added to the input before positioning
        setTimeout(() => {
          updatePosition();
        }, 0);
      } else if (keyEvent.key === "Escape") {
        resetTypeahead();
      }
    };

    input.addEventListener("keydown", handleKeyDown);
    return () => input.removeEventListener("keydown", handleKeyDown);
  }, [
    triggerChar,
    options,
    updatePosition,
    resetTypeahead,
    inputRef,
    activateMode,
  ]);

  // Track cursor movement with click and selection but avoid re-rendering on arrow keys
  useEffect(() => {
    if (!inputRef.current || !isActive) return;

    const input = inputRef.current;

    const handleCursorMove = (e: Event) => {
      const keyEvent = e as KeyboardEvent;
      // Only update position for non-arrow key events to prevent blinking
      const isArrowKey =
        keyEvent.key === "ArrowUp" ||
        keyEvent.key === "ArrowDown" ||
        keyEvent.key === "ArrowLeft" ||
        keyEvent.key === "ArrowRight";

      if (e.type !== "keyup" || !isArrowKey) {
        updatePosition();
      }
    };

    // Track all events that might move the cursor
    input.addEventListener("click", handleCursorMove);
    input.addEventListener("keyup", handleCursorMove);
    input.addEventListener("mouseup", handleCursorMove);

    return () => {
      input.removeEventListener("click", handleCursorMove);
      input.removeEventListener("keyup", handleCursorMove);
      input.removeEventListener("mouseup", handleCursorMove);
    };
  }, [isActive, updatePosition, inputRef]);

  // Track widget state changes
  useEffect(() => {
    if (!onWidgetStateChange) return;

    const searchInfo = getSearchText(inputRef, triggerChar);
    onWidgetStateChange({
      isActive,
      currentSearch: searchInfo?.currentSearch || "",
      selectedOption: filteredOptions[activeIndex],
    });
  }, [
    isActive,
    filteredOptions,
    activeIndex,
    inputRef,
    triggerChar,
    onWidgetStateChange,
  ]);

  // Update keyboard navigation to use just Alt/Option key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive || !filteredOptions.length) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          // Set keyboard navigation as active
          isKeyboardNavActive.current = true;

          setActiveIndex((prev) => {
            const newIndex = (prev + 1) % filteredOptions.length;
            // Scroll the newly active option into view
            setTimeout(() => scrollActiveOptionIntoView(newIndex), 0);
            return newIndex;
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          // Set keyboard navigation as active
          isKeyboardNavActive.current = true;

          setActiveIndex((prev) => {
            const newIndex =
              (prev - 1 + filteredOptions.length) % filteredOptions.length;
            // Scroll the newly active option into view
            setTimeout(() => scrollActiveOptionIntoView(newIndex), 0);
            return newIndex;
          });
          break;
        case "Enter":
          if (isActive) {
            e.preventDefault();
            handleSelect(filteredOptions[activeIndex]);
          }
          break;
        case "Escape":
          if (isActive) {
            e.preventDefault();
            resetTypeahead();
          }
          break;
        case "Alt":
          if (isActive) {
            e.preventDefault();
            handleBack();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isActive,
    filteredOptions,
    activeIndex,
    handleSelect,
    resetTypeahead,
    handleBack,
    scrollActiveOptionIntoView,
  ]);

  // Reset keyboard navigation flag on mouse movement
  useEffect(() => {
    const handleMouseMove = () => {
      isKeyboardNavActive.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (isActive) {
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition);
      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition);
      };
    }
  }, [isActive, updatePosition]);

  if (!isActive || !portalRef.current || !filteredOptions.length) return null;

  return createPortal(
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        zIndex: 9999,
        visibility: "hidden",
        maxHeight: `${maxVisibleOptions * 36}px`,
        overflow: "auto",
        ...defaultContainerStyles,
        width: "360px",
        ...typeAheadContainerStyles,
        animation: "typeaheadFadeIn 0.18s ease-out forwards",
        transition: "all 0.18s ease-out",
        transform: "translateY(0)",
      }}
    >
      <style>
        {`
          @keyframes typeaheadFadeIn {
            0% {
              opacity: 0;
              transform: translateY(-8px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      {renderHeader ? (
        renderHeader({
          onClose: handleClose,
          onBack: handleBack,
          currentCategory: nestedPath[nestedPath.length - 1],
          nestedPath,
        })
      ) : (
        <TypeaheadHeader
          onClose={handleClose}
          onBack={handleBack}
          currentCategory={nestedPath[nestedPath.length - 1]}
          nestedPath={nestedPath}
        />
      )}

      {filteredOptions.map((option, index) => {
        const isActive = index === activeIndex;

        if (renderOption) {
          // If using a custom renderer, we still need to associate a key with the index
          const customOption = renderOption({
            option,
            isActive,
            onClick: () => {
              if (option.children && option.children.length > 0) {
                handleNestedNavigation(option);
              } else {
                handleSelect(option);
              }
            },
          });

          // Just add the key to the custom element to avoid type issues
          return React.isValidElement(customOption)
            ? React.cloneElement(customOption, {
                key: `${option.label}-${index}`,
              })
            : customOption;
        }

        return (
          <div
            key={`${option.label}-${index}`}
            ref={(node) => {
              if (node) {
                optionRefsMapRef.current.set(index, node);
              } else {
                optionRefsMapRef.current.delete(index);
              }
            }}
            style={{
              ...defaultOptionStyles,
              ...(isActive ? defaultActiveOptionStyle : {}),
              ...typeAheadOptionStyles,
              ...(isActive ? typeAheadActiveOptionStyle : {}),
            }}
            onMouseEnter={() => {
              // Only update active index if keyboard navigation is not active
              if (!isKeyboardNavActive.current) {
                setActiveIndex(index);
                scrollActiveOptionIntoView(index);
              }
            }}
            onClick={() => {
              if (option.children && option.children.length > 0) {
                handleNestedNavigation(option);
              } else {
                handleSelect(option);
              }
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "2px" }}
            >
              <span style={{ color: "#101418" }}>{option.label}</span>
              {option.children ? (
                <span
                  style={{
                    ...defaultValueStyles,
                    ...typeAheadOptionValueStyles,
                  }}
                >
                  {option.children.length} options
                </span>
              ) : null}
              {option.description ? (
                <span
                  style={{
                    ...defaultValueStyles,
                    ...typeAheadOptionValueStyles,
                  }}
                >
                  {option.description}
                </span>
              ) : null}
            </div>
            {option.children && option.children.length > 0 ? (
              <span
                style={{
                  rotate: "180deg",
                }}
              >
                <ChevronLeft />
              </span>
            ) : isActive ? (
              <span>
                <ArrowRounded />
              </span>
            ) : null}
          </div>
        );
      })}
    </div>,
    portalRef.current
  );
};
