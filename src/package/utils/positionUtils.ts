import { RefObject } from "react";

export interface CaretCoordinates {
  left: number;
  top: number;
}

export const getCaretCoordinates = (
  inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement>,
): CaretCoordinates => {
  if (!inputRef.current) return { top: 0, left: 0 };

  const input = inputRef.current;

  if (input instanceof HTMLTextAreaElement) {
    // Create a clone of the textarea with exact same styles and dimensions
    const clone = document.createElement("div");

    // Copy all computed styles
    const styles = window.getComputedStyle(input);
    Array.from(styles).forEach((prop) => {
      clone.style.setProperty(prop, styles.getPropertyValue(prop));
    });

    // Match dimensions of the textarea content area exactly
    clone.style.position = "absolute";
    clone.style.top = "0";
    clone.style.left = "0";
    clone.style.visibility = "hidden";
    clone.style.overflow = "hidden";
    clone.style.height = "auto";
    clone.style.width = `${input.clientWidth}px`;
    clone.style.boxSizing = "border-box";

    // Copy padding explicitly
    clone.style.paddingTop = styles.paddingTop;
    clone.style.paddingRight = styles.paddingRight;
    clone.style.paddingBottom = styles.paddingBottom;
    clone.style.paddingLeft = styles.paddingLeft;

    // Copy text-related styles
    clone.style.whiteSpace = styles.whiteSpace;
    clone.style.wordWrap = styles.wordWrap;
    clone.style.lineHeight = styles.lineHeight;
    clone.style.fontFamily = styles.fontFamily;
    clone.style.fontSize = styles.fontSize;
    clone.style.fontWeight = styles.fontWeight;

    // Get text up to cursor position
    const selectionStart = input.selectionStart || 0;
    const textBeforeCursor = input.value.substring(0, selectionStart);

    // Split by newlines and preserve them
    const textWithBreaks = textBeforeCursor.replace(/\n/g, "<br>");
    clone.innerHTML = textWithBreaks;

    // Add a span at the end to represent cursor position
    const cursorSpan = document.createElement("span");
    cursorSpan.textContent = "|";
    cursorSpan.style.display = "inline";
    cursorSpan.style.width = "0";
    cursorSpan.style.overflow = "hidden";
    clone.appendChild(cursorSpan);

    // Add to DOM, get position, then remove
    document.body.appendChild(clone);

    // Get client rect of cursor position
    const cursorRect = cursorSpan.getBoundingClientRect();
    const cloneRect = clone.getBoundingClientRect();

    document.body.removeChild(clone);

    // Apply padding offsets (since the clone might not include them in its position)
    const paddingLeft = parseInt(styles.paddingLeft) || 0;

    // Calculate position relative to input, accounting for scroll
    return {
      left: cursorRect.left - cloneRect.left + paddingLeft,
      top: cursorRect.top - cloneRect.top - input.scrollTop,
    };
  } else {
    // For single-line inputs
    const textBeforeCursor = input.value.substring(
      0,
      input.selectionStart || 0,
    );
    const span = document.createElement("span");
    span.style.font = window.getComputedStyle(input).font;
    span.style.position = "absolute";
    span.style.visibility = "hidden";
    span.style.whiteSpace = "pre";
    span.textContent = textBeforeCursor || "";
    document.body.appendChild(span);

    const width = span.getBoundingClientRect().width;
    document.body.removeChild(span);

    // Account for padding and scrolling
    const paddingLeft =
      parseInt(window.getComputedStyle(input).paddingLeft) || 0;

    return {
      left: width + paddingLeft - input.scrollLeft,
      top: 0,
    };
  }
};

export interface PositionConfig {
  position: "top" | "bottom" | "cursor";
  maxVisibleOptions: number;
  currentOptionsLength: number;
  containerRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement>;
  getCaretCoordinates: () => CaretCoordinates;
}

export const updatePosition = (config: PositionConfig) => {
  const {
    position,
    maxVisibleOptions,
    currentOptionsLength,
    containerRef,
    inputRef,
    getCaretCoordinates,
  } = config;

  if (!containerRef.current || !inputRef.current) return;

  const container = containerRef.current;
  const input = inputRef.current;
  const inputRect = input.getBoundingClientRect();

  // Keep container invisible until positioned correctly
  container.style.visibility = "hidden";
  container.style.opacity = "0";

  // Calculate container height based on options and max visible
  const optionCount = Math.min(currentOptionsLength, maxVisibleOptions);
  const optionHeight = 36; // Estimated height of an option
  const containerHeight = optionCount * optionHeight;
  const containerWidth = container.offsetWidth;

  // Constants for positioning
  const VERTICAL_SPACING = 8;
  const HORIZONTAL_OFFSET = -4;

  // Variables for positioning
  let leftPositionValue = "0px";
  let topPositionValue = "0px";
  let bottomPositionValue = "";

  if (position === "cursor") {
    // Get caret coordinates
    const caretCoords = getCaretCoordinates();

    // Calculate absolute position
    const cursorLeft = inputRect.left + caretCoords.left;
    const cursorTop = inputRect.top + caretCoords.top;

    // Account for line height
    const lineHeight =
      parseInt(window.getComputedStyle(input).lineHeight) ||
      parseInt(window.getComputedStyle(input).fontSize) ||
      16;

    // Check if there's enough space below the cursor
    const spaceBelow = window.innerHeight - (cursorTop + lineHeight);
    const spaceAbove = cursorTop;

    // Determine the best position based on available space
    const shouldPositionAbove =
      spaceBelow < containerHeight + VERTICAL_SPACING &&
      spaceAbove >= containerHeight + VERTICAL_SPACING;

    if (shouldPositionAbove) {
      // Position above the cursor
      topPositionValue = "";
      bottomPositionValue = `${window.innerHeight - cursorTop + VERTICAL_SPACING}px`;
    } else {
      // Position below the cursor
      topPositionValue = `${cursorTop + lineHeight + VERTICAL_SPACING}px`;
      bottomPositionValue = "";
    }

    // Determine horizontal position based on available space
    const leftPosition = Math.max(0, cursorLeft - HORIZONTAL_OFFSET);
    const rightOverflow = leftPosition + containerWidth > window.innerWidth;

    if (rightOverflow) {
      // Not enough space to the right, try positioning aligned to the right edge of the screen
      leftPositionValue = `${Math.max(0, window.innerWidth - containerWidth - 10)}px`;
    } else {
      // Enough space, position to the left of cursor
      leftPositionValue = `${leftPosition}px`;
    }
  } else {
    // For top/bottom positioning (relative to the input)
    const spaceAbove = inputRect.top;
    const spaceBelow = window.innerHeight - inputRect.bottom;

    // Determine the best position based on available space
    const effectivePosition =
      (position === "top" && spaceAbove < containerHeight + VERTICAL_SPACING) ||
      (position === "bottom" && spaceBelow < containerHeight + VERTICAL_SPACING)
        ? position === "top"
          ? "bottom"
          : "top"
        : position;

    // Horizontal positioning for input
    const leftPosition = inputRect.left;
    const rightOverflow = leftPosition + containerWidth > window.innerWidth;

    if (rightOverflow) {
      // Align to right edge of input
      leftPositionValue = `${Math.max(0, inputRect.right - containerWidth)}px`;
    } else {
      // Align to left edge of input
      leftPositionValue = `${leftPosition}px`;
    }

    // Vertical positioning - set either top or bottom but not both
    if (effectivePosition === "top") {
      topPositionValue = "";
      bottomPositionValue = `${window.innerHeight - inputRect.top + VERTICAL_SPACING}px`;
    } else {
      topPositionValue = `${inputRect.bottom + VERTICAL_SPACING}px`;
      bottomPositionValue = "";
    }
  }

  // Apply all positioning at once to prevent jitter
  container.style.left = leftPositionValue;
  container.style.top = topPositionValue;
  container.style.bottom = bottomPositionValue;

  // Make visible after all positioning is done
  // This prevents visible repositioning that causes jitter
  requestAnimationFrame(() => {
    if (container) {
      container.style.visibility = "visible";
      container.style.opacity = "1";
    }
  });
};
