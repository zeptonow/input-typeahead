# @zeptonow/input-typeahead

![Input Typeahead Demo](./docs/assets/input-typeahead-demo.png)
_Note: Replace with actual screenshot once available_

[![npm version](https://img.shields.io/npm/v/@zeptonow/input-typeahead.svg)](https://www.npmjs.com/package/@zeptonow/input-typeahead)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A lightweight, customizable React typeahead component that converts any input into a powerful typeahead with a dropdown of suggestions.

## Features

- 🚀 **Lightweight and Performant**: Minimal bundle size with optimized rendering
- 🎨 **Fully Customizable**: Style every aspect of the typeahead to match your UI
- 🧩 **Composable API**: Easily integrate with your existing components
- 🌐 **Keyboard Navigation**: Full keyboard support for accessibility
- 📱 **Responsive**: Works great on all device sizes
- 🔍 **Flexible Search**: Supports custom filtering logic
- 🔄 **Async Data**: Support for loading data from remote sources
- 🔀 **Nested Options**: Support for hierarchical dropdown menus with categories

## Installation

```bash
# Using npm
npm install @zeptonow/input-typeahead

# Using yarn
yarn add @zeptonow/input-typeahead

# Using pnpm
pnpm add @zeptonow/input-typeahead
```

## Quick Start

```jsx
import React, { useRef } from "react";
import { Typeahead } from "@zeptonow/input-typeahead";

function MyComponent() {
  const inputRef = useRef(null);

  const options = [
    {
      label: "Fruits",
      children: [
        { label: "Apple", value: "apple", description: "Red and juicy" },
        { label: "Banana", value: "banana", description: "Yellow and sweet" },
        { label: "Cherry", value: "cherry", description: "Small and tart" },
      ],
    },
    {
      label: "Vegetables",
      children: [
        { label: "Carrot", value: "carrot", description: "Orange and crunchy" },
        {
          label: "Broccoli",
          value: "broccoli",
          description: "Green and healthy",
        },
      ],
    },
  ];

  return (
    <>
      <input ref={inputRef} type="text" placeholder="Type / to see options" />
      <Typeahead
        inputRef={inputRef}
        options={options}
        triggerChar="/"
        position="cursor"
        activateMode="multiple"
        onSelect={(option) => console.log("Selected:", option)}
      />
    </>
  );
}
```

## Keyboard Shortcuts

The typeahead component supports the following keyboard shortcuts for efficient navigation:

| Key                                  | Function                                                    |
| ------------------------------------ | ----------------------------------------------------------- |
| **Arrow Up**                         | Navigate to previous option                                 |
| **Arrow Down**                       | Navigate to next option                                     |
| **Enter**                            | Select the currently highlighted option                     |
| **Escape**                           | Close the typeahead dropdown                                |
| **Option** (Mac) / **Alt** (Windows) | Go back to the parent menu when navigating nested dropdowns |

## Nested Dropdowns

The typeahead component supports hierarchical options with nested categories. When using nested options:

1. Navigate into a category by selecting it with Enter or clicking on it
2. Navigate back to the parent menu using the Option key (Mac) or Alt key (Windows)
3. Breadcrumb navigation is automatically displayed when you're in a nested menu
4. Categories are visually distinguished from regular options

Example of nested options structure:

```jsx
const options = [
  {
    label: "Category A",
    children: [
      { label: "Option A1", value: "a1" },
      { label: "Option A2", value: "a2" },
      {
        label: "Subcategory",
        children: [
          { label: "Nested Option 1", value: "n1" },
          { label: "Nested Option 2", value: "n2" },
        ],
      },
    ],
  },
  {
    label: "Category B",
    children: [
      { label: "Option B1", value: "b1" },
      { label: "Option B2", value: "b2" },
    ],
  },
];
```

## API Reference

### `<Typeahead>` Props

| Prop                         | Type                                                       | Default      | Description                                                    |
| ---------------------------- | ---------------------------------------------------------- | ------------ | -------------------------------------------------------------- |
| `inputRef`                   | `React.RefObject<HTMLInputElement \| HTMLTextAreaElement>` | Required     | Reference to the input or textarea element                     |
| `options`                    | `ZeptoTypeAheadOption[]`                                   | `[]`         | Array of options to display in the dropdown                    |
| `triggerChar`                | `string`                                                   | `'/'`        | Character that triggers the typeahead dropdown                 |
| `position`                   | `'top' \| 'bottom' \| 'cursor'`                            | `'bottom'`   | Position of the dropdown relative to the input                 |
| `activateMode`               | `'single' \| 'multiple'`                                   | `'multiple'` | Whether typeahead can be triggered multiple times in the input |
| `typeAheadContainerStyles`   | `React.CSSProperties`                                      | -            | Custom styles for the typeahead container                      |
| `typeAheadOptionStyles`      | `React.CSSProperties`                                      | -            | Custom styles for each option                                  |
| `typeAheadActiveOptionStyle` | `React.CSSProperties`                                      | -            | Custom styles for the active option                            |
| `typeAheadOptionValueStyles` | `React.CSSProperties`                                      | -            | Custom styles for option values                                |
| `onSelect`                   | `(option: ZeptoTypeAheadOption) => void`                   | -            | Callback fired when an option is selected                      |
| `searchCallback`             | `(label: string, value: string) => boolean`                | -            | Custom search function for filtering options                   |
| `renderOption`               | `({ option, isActive, onClick }) => React.ReactNode`       | -            | Custom render function for options                             |
| `renderHeader`               | `(props: ZeptoTypeAheadHeaderProps) => React.ReactNode`    | -            | Custom render function for the typeahead header                |
| `onWidgetStateChange`        | `(state: ZeptoTypeAheadWidgetState) => void`               | -            | Callback fired when widget state changes                       |

### Types

```typescript
type ZeptoTypeAheadOption = {
  label: string;
  description?: string;
  value?: string;
  children?: ZeptoTypeAheadOption[];
};

type ZeptoTypeAheadPosition = "top" | "bottom" | "cursor";

type ZeptoTypeAheadActivateMode = "single" | "multiple";

type ZeptoTypeAheadHeaderProps = {
  onClose: () => void;
  onBack: () => void;
  currentLevel?: ZeptoTypeAheadOption;
  nestedPath: ZeptoTypeAheadOption[];
};

type ZeptoTypeAheadWidgetState = {
  isActive: boolean;
  currentSearch: string;
  selectedOption?: ZeptoTypeAheadOption;
};
```

## Customization

### Custom Styling

```jsx
<Typeahead
  inputRef={inputRef}
  options={options}
  typeAheadContainerStyles={{
    border: "1px solid #ccc",
    borderRadius: "4px",
  }}
  typeAheadOptionStyles={{
    padding: "12px",
    fontSize: "14px",
  }}
  typeAheadActiveOptionStyle={{
    background: "#f0f0f0",
  }}
/>
```

### Custom Rendering

```jsx
<Typeahead
  inputRef={inputRef}
  options={options}
  renderOption={({ option, isActive, onClick }) => (
    <div
      onClick={onClick}
      style={{
        background: isActive ? "#e0f7fa" : "white",
        display: "flex",
        alignItems: "center",
        padding: "8px 16px",
      }}
    >
      <div style={{ marginRight: "8px" }}>🔍</div>
      <div>
        <div style={{ fontWeight: 500 }}>{option.label}</div>
        {option.description && (
          <div style={{ fontSize: "0.8em", color: "#666" }}>
            {option.description}
          </div>
        )}
      </div>
    </div>
  )}
/>
```

## Async Data Loading

```jsx
import React, { useState, useEffect, useRef } from "react";
import { Typeahead } from "@zeptonow/input-typeahead";

function AsyncTypeahead() {
  const inputRef = useRef(null);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentInput, setCurrentInput] = useState("");

  // Track input changes manually
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleInput = () => {
      setCurrentInput(input.value);
    };

    input.addEventListener("input", handleInput);
    return () => input.removeEventListener("input", handleInput);
  }, []);

  // Fetch data when input changes
  useEffect(() => {
    if (!currentInput.includes("/")) return;

    const query = currentInput.split("/").pop();
    if (!query) return;

    setLoading(true);
    fetchData(query).then((results) => {
      // Transform API results to match ZeptoTypeAheadOption format
      const formattedResults = results.map((item) => ({
        label: item.name,
        value: item.id,
        description: item.description,
      }));

      setOptions([
        {
          label: "Search Results",
          children: formattedResults,
        },
      ]);
      setLoading(false);
    });
  }, [currentInput]);

  return (
    <div>
      {loading && <div>Loading suggestions...</div>}
      <input
        ref={inputRef}
        type="text"
        placeholder="Type / followed by search term"
      />
      <Typeahead
        inputRef={inputRef}
        options={options}
        triggerChar="/"
        position="bottom"
        onSelect={(option) => console.log("Selected:", option)}
      />
    </div>
  );
}

// Mock API function
function fetchData(query) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        [
          { id: "1", name: "Result 1", description: "First search result" },
          { id: "2", name: "Result 2", description: "Second search result" },
          { id: "3", name: "Result 3", description: "Third search result" },
        ].filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase()),
        ),
      );
    }, 500);
  });
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
