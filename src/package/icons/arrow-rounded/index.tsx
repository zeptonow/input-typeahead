import type { JSX } from "react";
const ArrowRounded = (props: JSX.IntrinsicElements["svg"]) => {
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
        fillRule="evenodd"
        d="M13.333 2c.368 0 .667.298.667.667v.963c0 1.095 0 1.957-.057 2.651-.058.709-.178 1.3-.452 1.838a4.667 4.667 0 0 1-2.039 2.039c-.537.274-1.129.394-1.837.452-.694.057-1.557.057-2.652.057H4.276l2.195 2.195a.667.667 0 1 1-.942.943L2.195 10.47a.667.667 0 0 1 0-.942L5.53 6.195a.667.667 0 1 1 .942.943L4.276 9.333h2.657c1.131 0 1.94 0 2.573-.052.626-.051 1.022-.149 1.34-.311a3.334 3.334 0 0 0 1.457-1.457c.162-.318.26-.714.311-1.34.052-.634.053-1.442.053-2.573v-.933c0-.369.298-.667.666-.667Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default ArrowRounded;
