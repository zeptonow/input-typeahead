import React from "react";
import { ZeptoTypeAheadOption } from "../types";
import styles from "./Typeahead.module.css";

export interface TypeaheadOptionProps {
  option: ZeptoTypeAheadOption;
  isActive: boolean;
  customStyles?: React.CSSProperties;
  activeStyles?: React.CSSProperties;
  onClick: () => void;
}

export const TypeaheadOption: React.FC<TypeaheadOptionProps> = ({
  option,
  isActive,
  customStyles,
  activeStyles,
  onClick,
}) => {
  return (
    <div
      className={`${styles.typeaheadOption} ${
        isActive ? styles.typeaheadOptionActive : ""
      }`}
      style={{
        ...customStyles,
        ...(isActive ? activeStyles : {}),
      }}
      onClick={onClick}
    >
      <div className={styles.typeaheadOptionContent}>
        <div className={styles.typeaheadOptionLabel}>{option.label}</div>
        {option.description && (
          <div className={styles.typeaheadOptionDescription}>
            {option.description}
          </div>
        )}
      </div>
      {option.children && option.children.length > 0 && (
        <svg
          className={styles.typeaheadOptionArrow}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 6L15 12L9 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
};
