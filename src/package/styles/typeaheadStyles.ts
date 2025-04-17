import { CSSProperties } from "react";

export const defaultContainerStyles: CSSProperties = {
    minHeight: "386px",
    backgroundColor: "white",
    boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
    borderRadius: "8px",
    border: "1px solid rgba(0,0,0,0.1)",
    minWidth: "180px",
    overflowY: "auto",
};

export const defaultHeaderStyles: CSSProperties = {
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
    position: 'sticky',
    top: 0,
    left: 0,
    zIndex: 2,
    backgroundColor: "white",
};

export const defaultHeaderTitleStyles: CSSProperties = {
    fontSize: "14px",
    fontWeight: 600,
    color: "#101418",
    margin: 0,
};

export const defaultNestedHeaderStyles: CSSProperties = {
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
    position: 'sticky',
    top: 0,
    left: 0,
    zIndex: 2,
    backgroundColor: "white",
};

export const defaultNestedHeaderTitleStyles: CSSProperties = {
    fontSize: "14px",
    fontWeight: 500,
    color: "#101418",
    margin: 0,
};

export const defaultOptionStyles: CSSProperties = {
    fontSize: "12px",
    color: "#101418",
    padding: "8px 12px",
    fontWeight: 500,
    lineHeight: "20px",
    letterSpacing: "0.1px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
};

export const defaultValueStyles: CSSProperties = {
    fontSize: "12px",
    color: "#5A6477",
    fontWeight: 400,
    lineHeight: "16px",
    letterSpacing: "0.1px",
};

export const defaultActiveOptionStyle: CSSProperties = {
    background: "#F8E9FC",
}; 