import type { SVGProps } from "../../types/svg";

const ChevronLeft = (props: SVGProps) => {
  const { fill = "#667085" } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
      <path
        fill={fill}
        stroke={fill}
        strokeWidth=".8"
        d="M10.354 12.646a.5.5 0 1 1-.707.708l-5-5a.5.5 0 0 1 0-.708l5-5a.5.5 0 1 1 .707.708L5.707 8l4.647 4.646Z"
      />
    </svg>
  );
};

export default ChevronLeft;
