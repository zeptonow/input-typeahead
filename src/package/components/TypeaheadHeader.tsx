import { ZeptoTypeAheadHeaderProps } from "../types";

import {
  defaultNestedHeaderStyles,
  defaultNestedHeaderTitleStyles,
  defaultHeaderStyles,
  defaultHeaderTitleStyles,
} from "../styles/typeaheadStyles";
import ChevronLeft from "../icons/chevron-left";
import Close from "../icons/close";

const TypeaheadHeader: React.FC<ZeptoTypeAheadHeaderProps> = ({
  onClose,
  onBack,
  currentCategory,
  nestedPath,
}) => {
  if (nestedPath.length > 0) {
    return (
      <div style={defaultNestedHeaderStyles}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ChevronLeft />
          </button>
          <h3 style={defaultNestedHeaderTitleStyles}>
            {currentCategory?.label || "Back"}
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div style={defaultHeaderStyles}>
      <h3 style={defaultHeaderTitleStyles}>Response Shortcuts</h3>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Close />
      </button>
    </div>
  );
};

export default TypeaheadHeader;
