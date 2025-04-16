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

  const resetTypeahead = useCallback(() => {
    setIsActive(false);
    setActiveIndex(0);
    setNestedPath([]);
    setCurrentOptions(options);
    setFilteredOptions([]);
  }, [options]);

  const filterOptions = useCallback(
    (value: string, optionsToFilter: ZeptoTypeAheadOption[]) => {
      if (!value) return optionsToFilter;

      return optionsToFilter.filter((option) => {
        if (searchCallback) {
          return searchCallback(option.label, value);
        }
        return option.label.toLowerCase().includes(value.toLowerCase());
      });
    },
    [searchCallback]
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
    if (!inputRef.current || !isActive) return;

    const input = inputRef.current;
    const handleInput = () => {
      const searchInfo = getSearchText(inputRef, triggerChar);
      if (!searchInfo) {
        resetTypeahead();
        setNestedPath([]);
        return;
      }

      const { searchStart, currentSearch } = searchInfo;

      // Check if the trigger character is standalone (preceded by space or start of line)
      const isStandaloneTrigger =
        searchStart === 0 ||
        (searchStart > 0 && /\s/.test(input.value.charAt(searchStart - 1)));

      if (!isStandaloneTrigger) {
        resetTypeahead();
        setNestedPath([]);
        return;
      }

      // For single mode, only allow the typeahead if trigger is the first non-whitespace character
      if (activateMode === "single") {
        const textBeforeTrigger = input.value.substring(0, searchStart).trim();
        if (textBeforeTrigger.length > 0) {
          resetTypeahead();
          setNestedPath([]);
          return;
        }
      }

      // Check if there's a space after the trigger character, if so close the typeahead
      if (currentSearch.includes(" ")) {
        resetTypeahead();
        setNestedPath([]);
        return;
      }

      // Update the searchValue state

      // Filter options based on current path and search text
      if (nestedPath.length > 0) {
        // Only filter current level options when in nested mode
        const filteredNestedOptions =
          nestedPath[nestedPath.length - 1].children?.filter((option) => {
            if (searchCallback) {
              return searchCallback(option.label, currentSearch);
            }
            return option.label
              .toLowerCase()
              .includes(currentSearch.toLowerCase());
          }) || [];

        setFilteredOptions(filteredNestedOptions);

        // Close typeahead if no results found
        if (filteredNestedOptions.length === 0) {
          resetTypeahead();
          setNestedPath([]);
          return;
        }
      } else {
        let filtered;
        // Don't filter if the search text is empty
        if (currentSearch === "") {
          filtered = options;
        } else {
          // Filter options based on search text
          filtered = filterOptions(currentSearch, options);
        }

        setFilteredOptions(filtered);

        // Close typeahead if no results found
        if (filtered.length === 0) {
          resetTypeahead();
          setNestedPath([]);
          return;
        }
      }

      // Update position after input changes
      updatePosition();
    };

    input.addEventListener("input", handleInput);
    return () => input.removeEventListener("input", handleInput);
  }, [
    isActive,
    nestedPath,
    options,
    resetTypeahead,
    filterOptions,
    triggerChar,
    updatePosition,
    inputRef,
    activateMode,
    searchCallback,
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
          setActiveIndex((prev) => (prev + 1) % filteredOptions.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex(
            (prev) =>
              (prev - 1 + filteredOptions.length) % filteredOptions.length
          );
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
  ]);

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
          return renderOption({
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
        }

        return (
          <div
            key={option.label}
            style={{
              ...defaultOptionStyles,
              ...(isActive ? defaultActiveOptionStyle : {}),
              ...typeAheadOptionStyles,
              ...(isActive ? typeAheadActiveOptionStyle : {}),
            }}
            onMouseEnter={() => setActiveIndex(index)}
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
