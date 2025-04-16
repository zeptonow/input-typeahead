import React, { useRef } from "react";
import { Typeahead } from "../package/components/Typeahead";
import {
  ZeptoTypeAheadOption,
  TypeaheadOptionProps,
  ZeptoTypeAheadHeaderProps,
} from "../package/types";

const options: ZeptoTypeAheadOption[] = [
  {
    label: "Apoli",
    description: "Common greetings for customer support",
    children: [
      {
        label: "Hello",
        value: "Hello, how can I assist you today?",
        description: "Standard greeting",
      },
      {
        label: "Good Morning",
        children: [
          {
            label: "Good Morning",
            value: "Good Morning! How can I assist you today?",
            description: "Morning greeting",
          },
        ],
        description: "Morning greeting",
      },
    ],
  },
  {
    label: "Apology",
    description: "Apologies for customer support",
    children: [
      {
        label: "Sorry for the inconvenience",
        value: "We are sorry for the inconvenience caused.",
        description: "General apology",
      },
      {
        label: "Apology for delay",
        value: "We apologize for the delay in our response.",
        description: "Apology for delayed response",
      },
    ],
  },
];

const CustomOption: React.FC<TypeaheadOptionProps> = ({
  option,
  isActive,
  onClick,
}) => (
  <div
    onClick={onClick}
    onMouseEnter={() => {
      // Add hover effect
      const element = document.activeElement as HTMLElement;
      if (element) {
        element.style.background = isActive ? "#f0f0f0" : "#f8f9fa";
      }
    }}
    onMouseLeave={() => {
      // Remove hover effect
      const element = document.activeElement as HTMLElement;
      if (element) {
        element.style.background = isActive ? "#f0f0f0" : "white";
      }
    }}
    style={{
      padding: "8px 16px",
      background: isActive ? "#f0f0f0" : "white",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div style={{ fontWeight: 500 }}>{option.label}</div>
    {option.description && (
      <div style={{ fontSize: "0.8em", color: "#666" }}>
        {option.description}
      </div>
    )}
  </div>
);

const CustomHeader = ({
  onClose,
  onBack,
  currentCategory,
  nestedPath,
}: ZeptoTypeAheadHeaderProps) => (
  <div style={{ padding: "8px 16px", borderBottom: "1px solid #eee" }}>
    <h3 style={{ margin: 0 }}>Typeahead Menu</h3>
    <button onClick={onClose}>Close</button>
    <button onClick={onBack}>Back</button>
    <h3 style={{ margin: 0 }}>{currentCategory?.label}</h3>
  </div>
);

export const TypeaheadTest: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const singleModeRef = useRef<HTMLInputElement>(null);
  const customTriggerRef = useRef<HTMLInputElement>(null);
  const customPositionRef = useRef<HTMLInputElement>(null);
  const topPositionRef = useRef<HTMLInputElement>(null);
  const searchCallbackRef = useRef<HTMLInputElement>(null);
  const customHeaderRef = useRef<HTMLInputElement>(null);

  const customSearchCallback = (optionLabel: string, searchText: string) => {
    // Custom search logic - only match if the search text is at the start of the label
    return optionLabel.toLowerCase().startsWith(searchText.toLowerCase());
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Typeahead Test Component</h2>

      <div style={{ marginBottom: "20px" }}>
        <h3>1. Default Input (Multiple Mode)</h3>
        <input
          ref={inputRef}
          type="text"
          style={{ width: "100%", padding: "8px" }}
          placeholder="Type / to activate typeahead"
        />
        <Typeahead
          inputRef={inputRef}
          options={options}
          triggerChar="/"
          position="cursor"
          activateMode="multiple"
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>2. Textarea (Single Mode)</h3>
        <textarea
          ref={textareaRef}
          style={{ width: "100%", height: "100px", padding: "8px" }}
          placeholder="Type / to activate typeahead"
        />
        <Typeahead
          inputRef={textareaRef}
          options={options}
          triggerChar="/"
          position="cursor"
          activateMode="single"
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>3. Custom Option Rendering with Hover Effects</h3>
        <input
          ref={singleModeRef}
          type="text"
          style={{ width: "100%", padding: "8px" }}
          placeholder="Type / to activate typeahead"
        />
        <Typeahead
          inputRef={singleModeRef}
          options={options}
          triggerChar="/"
          position="cursor"
          activateMode="multiple"
          renderOption={CustomOption}
          renderHeader={CustomHeader}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>4. Custom Trigger Character</h3>
        <input
          ref={customTriggerRef}
          type="text"
          style={{ width: "100%", padding: "8px" }}
          placeholder="Type @ to activate typeahead"
        />
        <Typeahead
          inputRef={customTriggerRef}
          options={options}
          triggerChar="@"
          position="cursor"
          activateMode="multiple"
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>5. Different Positions</h3>
        <input
          ref={customPositionRef}
          type="text"
          style={{ width: "100%", padding: "8px" }}
          placeholder="Type / to activate typeahead"
        />
        <Typeahead
          inputRef={customPositionRef}
          options={options}
          triggerChar="/"
          position="bottom"
          activateMode="multiple"
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>6. Different Positions (Top)</h3>
        <input
          ref={topPositionRef}
          type="text"
          style={{ width: "100%", padding: "8px" }}
          placeholder="Type / to activate typeahead"
        />
        <Typeahead
          inputRef={topPositionRef}
          options={options}
          triggerChar="/"
          position="top"
          activateMode="multiple"
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>6. Custom Search Callback</h3>
        <input
          ref={searchCallbackRef}
          type="text"
          style={{ width: "100%", padding: "8px" }}
          placeholder="Type / to activate typeahead (only matches start of words)"
        />
        <Typeahead
          inputRef={searchCallbackRef}
          options={options}
          triggerChar="/"
          position="cursor"
          activateMode="multiple"
          searchCallback={customSearchCallback}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>6. Custom Header Rendering</h3>
        <input
          ref={customHeaderRef}
          type="text"
          style={{ width: "100%", padding: "8px" }}
          placeholder="Type / to activate typeahead (only matches start of words)"
        />
        <Typeahead
          inputRef={customHeaderRef}
          options={options}
          triggerChar="/"
          position="cursor"
          activateMode="multiple"
          renderHeader={CustomHeader}
        />
      </div>
    </div>
  );
};
