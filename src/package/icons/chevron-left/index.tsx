import type { JSX } from "react";

const ChevronLeft = (props: JSX.IntrinsicElements["svg"]) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      {...props}
    >
      <path
        fill="currentColor"
        stroke="currentColor"
        strokeWidth=".8"
        d="M10.354 12.646a.5.5 0 1 1-.707.708l-5-5a.5.5 0 0 1 0-.708l5-5a.5.5 0 1 1 .707.708L5.707 8l4.647 4.646Z"
      />
    </svg>
  );
};

export default ChevronLeft;
