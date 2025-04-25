import React, { type MouseEventHandler } from "react";
import type { ZeptoTypeAheadOption } from "../types";
import ChevronLeft from "../icons/chevron-left";
import ArrowRounded from "../icons/arrow-rounded";
import {
  defaultOptionStyles,
  defaultActiveOptionStyle,
  defaultValueStyles,
} from "../styles/typeaheadStyles";

export interface TypeaheadOptionProps {
  option: ZeptoTypeAheadOption;
  isActive: boolean;
  customStyles?: React.CSSProperties;
  activeStyles?: React.CSSProperties;
  valueStyles?: React.CSSProperties;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export const TypeaheadOption: React.FC<TypeaheadOptionProps> = ({
  option,
  isActive,
  customStyles,
  activeStyles,
  valueStyles,
  onClick,
}) => {
  return (
    <button
      style={{
        ...defaultOptionStyles,
        ...(isActive ? defaultActiveOptionStyle : {}),
        ...customStyles,
        ...(isActive ? activeStyles : {}),
      }}
      onClick={onClick}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          width: "90%",
          flexShrink: 0,
        }}
      >
        <span style={{ color: "#101418" }}>{option.label}</span>
        {option.children ? (
          <span
            style={{
              ...defaultValueStyles,
              ...valueStyles,
            }}
          >
            {option.children.length} options
          </span>
        ) : null}
        {option.description ? (
          <span
            style={{
              ...defaultValueStyles,
              ...valueStyles,
            }}
          >
            {option.description}
          </span>
        ) : null}
      </div>
      <div style={{ width: "10%", textAlign: "center", flexShrink: 0 }}>
        {option.children && option.children.length > 0 ? (
          <span style={{ rotate: "180deg", display: "inline-block" }}>
            <ChevronLeft color={isActive ? "#9C27B0" : "#667085"} />
          </span>
        ) : isActive ? (
          <span style={{ display: "inline-block" }}>
            <ArrowRounded color={isActive ? "#9C27B0" : "#5A6477"} />
          </span>
        ) : null}
      </div>
    </button>
  );
};
