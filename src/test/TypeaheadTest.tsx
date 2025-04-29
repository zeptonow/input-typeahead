import React, { useRef } from "react";
import { Typeahead } from "../package/components/Typeahead";
import {
  ZeptoTypeAheadOption,
  ZeptoTypeAhead,
  ZeptoTypeAheadHeaderProps,
} from "../package/types";

const options: ZeptoTypeAheadOption[] = [
  {
    label: "Opening",
    children: [
      {
        label: "Response 1",
        value:
          "Hi there! You've reached Zepto support. Let me review your concern and I'll do my best to resolve it for you.",
        description:
          "Hi there! You've reached Zepto support. Let me review your concern and I'll do my best to resolve it for you.",
      },
      {
        label: "Response 2",
        value:
          "Hello there! You've reached Zepto support. Let me review your concern and I'll do my best to resolve it for you.",
        description:
          "Hello there! You've reached Zepto support. Let me review your concern and I'll do my best to resolve it for you.",
      },
    ],
  },
  {
    label: "Welcome",
    children: [
      {
        label: "Response 1",
        value:
          "Hi there! You've reached Zepto support. Let me review your concern and I'll do my best to resolve it for you.",
        description:
          "Hi there! You've reached Zepto support. Let me review your concern and I'll do my best to resolve it for you.",
      },
      {
        label: "Response 2",
        value:
          "Hello there! You've reached Zepto support. Let me review your concern and I'll do my best to resolve it for you.",
        description:
          "Hello there! You've reached Zepto support. Let me review your concern and I'll do my best to resolve it for you.",
      },
    ],
  },
  {
    label: "Hi",
    children: [
      {
        label: "Response 1",
        value:
          "Hi there! You've reached Zepto support. Let me review your concern and I'll do my best to resolve it for you.",
        description:
          "Hi there! You've reached Zepto support. Let me review your concern and I'll do my best to resolve it for you.",
      },
      {
        label: "Response 2",
        value:
          "Hello there! You've reached Zepto support. Let me review your concern and I'll do my best to resolve it for you.",
        description:
          "Hello there! You've reached Zepto support. Let me review your concern and I'll do my best to resolve it for you.",
      },
    ],
  },
  {
    label: "Closing",
    children: [
      {
        label: "Response 1",
        value:
          "We appreciate your time today. Thank you for choosing Zepto, and being our valued customers.",
        description:
          "We appreciate your time today. Thank you for choosing Zepto, and being our valued customers.",
      },
      {
        label: "Response 2",
        value:
          "Thank you for choosing Zepto. We\u2019re grateful for your trust and look forward to serving you again soon.",
        description:
          "Thank you for choosing Zepto. We\u2019re grateful for your trust and look forward to serving you again soon.",
      },
    ],
  },
  {
    label: "CSAT",
    value:
      "I hope I was able to address your concern and resolve it to your satisfaction. At the end of this chat, you will receive a short survey. It would be great if you could stay back for a few seconds and rate this conversation with me.",
    description:
      "I hope I was able to address your concern and resolve it to your satisfaction. At the end of this chat, you will receive a short survey. It would be great if you could stay back for a few seconds and rate this conversation with me.",
  },
  {
    label: "Acknowledgement",
    children: [
      {
        label: "Response 1",
        value:
          "I understand your concern, and we're dedicated to resolving it promptly. Thank you for bringing this to our attention.",
        description:
          "I understand your concern, and we're dedicated to resolving it promptly. Thank you for bringing this to our attention.",
      },
      {
        label: "Response 2",
        value:
          "Thank you for highlighting this. We understand your concern and will ensure it\u2019s resolved as quickly as possible.",
        description:
          "Thank you for highlighting this. We understand your concern and will ensure it\u2019s resolved as quickly as possible.",
      },
    ],
  },
  {
    label: "Apology",
    children: [
      {
        label: "Response 1",
        value:
          "I apologize for the inconvenience. We'll do everything we can to address this issue for you.",
        description:
          "I apologize for the inconvenience. We'll do everything we can to address this issue for you.",
      },
      {
        label: "Response 2",
        value:
          "I\u2019m committed to making it right for you. It was not our intention to have you face this issue.",
        description:
          "I\u2019m committed to making it right for you. It was not our intention to have you face this issue.",
      },
    ],
  },
  {
    label: "Empathy",
    children: [
      {
        label: "Response 1",
        value:
          "I understand your concern, and I want to assure you that we\u2019ll do everything we can to resolve this quickly.",
        description:
          "I understand your concern, and I want to assure you that we\u2019ll do everything we can to resolve this quickly.",
      },
      {
        label: "Response 2",
        value:
          "I completely understand how frustrating this must be for you, and I\u2019m here to help.",
        description:
          "I completely understand how frustrating this must be for you, and I\u2019m here to help.",
      },
    ],
  },
  {
    label: "Sympathy",
    value:
      "We understand how this situation may have caused inconvenience, and we truly regret any trouble you've experienced.",
    description:
      "We understand how this situation may have caused inconvenience, and we truly regret any trouble you've experienced.",
  },
  {
    label: "Inconvenience",
    value:
      "We understand how this situation may have caused inconvenience, and we truly regret any trouble you've experienced.",
    description:
      "We understand how this situation may have caused inconvenience, and we truly regret any trouble you've experienced.",
  },
  {
    label: "Elaborate",
    value:
      "Our sincere apologies for the unpleasant experience. Kindly elaborate on the issue. I will do my best to assist you further.",
    description:
      "Our sincere apologies for the unpleasant experience. Kindly elaborate on the issue. I will do my best to assist you further.",
  },
  {
    label: "General Hold",
    children: [
      {
        label: "Response 1",
        value: "Please stay connected for 2-3 minutes while I look into it.",
        description:
          "Please stay connected for 2-3 minutes while I look into it.",
      },
      {
        label: "Response 2",
        value:
          "I request you to give me 2-3 minutes while I check your order details.",
        description:
          "I request you to give me 2-3 minutes while I check your order details.",
      },
    ],
  },
  {
    label: "Refresh",
    value:
      "It is taking longer than expected. Request you to stay connected for another 2 minutes while I look into it.",
    description:
      "It is taking longer than expected. Request you to stay connected for another 2 minutes while I look into it.",
  },
  {
    label: "Patience",
    value: "Thank you for your patience.",
    description: "Thank you for your patience.",
  },
  {
    label: "Thank You",
    value: "Thank you for your patience.",
    description: "Thank you for your patience.",
  },
  {
    label: "DNR Hold",
    children: [
      {
        label: "Response 1",
        value:
          "Thank you for your patience. I\u2019m still working on this for you and just need a bit more time to ensure we get the best solution. I\u2019ll be with you shortly.\n We appreciate your patience.",
        description:
          "Thank you for your patience. I\u2019m still working on this for you and just need a bit more time to ensure we get the best solution. I\u2019ll be with you shortly.\n We appreciate your patience.",
      },
      {
        label: "Response 2",
        value:
          "I appreciate you holding on. My apologies for the delay; we're giving this the attention it needs. I'll be back in a moment with an update or next steps. Please stay connected.\nWe value your time and appreciate your patience.",
        description:
          "I appreciate you holding on. My apologies for the delay; we're giving this the attention it needs. I'll be back in a moment with an update or next steps. Please stay connected.\nWe value your time and appreciate your patience.",
      },
    ],
  },
  {
    label: "Hold",
    children: [
      {
        label: "Response 1",
        value:
          "Thank you for your patience. I\u2019m still working on this for you and just need a bit more time to ensure we get the best solution. I\u2019ll be with you shortly.\n We appreciate your patience.",
        description:
          "Thank you for your patience. I\u2019m still working on this for you and just need a bit more time to ensure we get the best solution. I\u2019ll be with you shortly.\n We appreciate your patience.",
      },
      {
        label: "Response 2",
        value:
          "I appreciate you holding on. My apologies for the delay; we're giving this the attention it needs. I'll be back in a moment with an update or next steps. Please stay connected.\nWe value your time and appreciate your patience.",
        description:
          "I appreciate you holding on. My apologies for the delay; we're giving this the attention it needs. I'll be back in a moment with an update or next steps. Please stay connected.\nWe value your time and appreciate your patience.",
      },
    ],
  },
  {
    label: "MQ",
    children: [
      {
        label: "Response 1",
        value:
          "We apologize for the inconvenience caused. It was never our intention for you to face such issues, and we\u2019re taking steps to prevent this from happening again in the future.",
        description:
          "We apologize for the inconvenience caused. It was never our intention for you to face such issues, and we\u2019re taking steps to prevent this from happening again in the future.",
      },
      {
        label: "Response 2",
        value:
          "We want to make sure it\u2019s handled accurately. I\u2019m transferring this chat to a supervisor to ensure you receive the best support. Please stay connected, you will be connected immediately.",
        description:
          "We want to make sure it\u2019s handled accurately. I\u2019m transferring this chat to a supervisor to ensure you receive the best support. Please stay connected, you will be connected immediately.",
      },
    ],
  },
  {
    label: "Transfer",
    children: [
      {
        label: "Response 1",
        value:
          "We apologize for the inconvenience caused. It was never our intention for you to face such issues, and we\u2019re taking steps to prevent this from happening again in the future.",
        description:
          "We apologize for the inconvenience caused. It was never our intention for you to face such issues, and we\u2019re taking steps to prevent this from happening again in the future.",
      },
      {
        label: "Response 2",
        value:
          "We want to make sure it\u2019s handled accurately. I\u2019m transferring this chat to a supervisor to ensure you receive the best support. Please stay connected, you will be connected immediately.",
        description:
          "We want to make sure it\u2019s handled accurately. I\u2019m transferring this chat to a supervisor to ensure you receive the best support. Please stay connected, you will be connected immediately.",
      },
    ],
  },
  {
    label: "Hold",
    value: "Thank you for staying connected, we appreciate your patience.",
    description:
      "Thank you for staying connected, we appreciate your patience.",
  },
  {
    label: "Refresh",
    value: "Thank you for staying connected, we appreciate your patience.",
    description:
      "Thank you for staying connected, we appreciate your patience.",
  },
  {
    label: "DNR Store Validation",
    value:
      "We have initiated the communication with the Delivery Hub, and they are checking into the details. This will take a maximum of 10 mins. Request you to bear with us till then. I will keep you updated.",
    description:
      "We have initiated the communication with the Delivery Hub, and they are checking into the details. This will take a maximum of 10 mins. Request you to bear with us till then. I will keep you updated.",
  },
  {
    label: "Queue",
    value:
      "We apologize for the inconvenience caused. It was never our intention for you to face such issue. We want to make sure it\u2019s handled accurately. I\u2019m transferring this chat to a supervisor to ensure you receive the best support. Please stay connected, you will be connected immediately.",
    description:
      "We apologize for the inconvenience caused. It was never our intention for you to face such issue. We want to make sure it\u2019s handled accurately. I\u2019m transferring this chat to a supervisor to ensure you receive the best support. Please stay connected, you will be connected immediately.",
  },
  {
    label: "Transfer",
    value:
      "We apologize for the inconvenience caused. It was never our intention for you to face such issue. We want to make sure it\u2019s handled accurately. I\u2019m transferring this chat to a supervisor to ensure you receive the best support. Please stay connected, you will be connected immediately.",
    description:
      "We apologize for the inconvenience caused. It was never our intention for you to face such issue. We want to make sure it\u2019s handled accurately. I\u2019m transferring this chat to a supervisor to ensure you receive the best support. Please stay connected, you will be connected immediately.",
  },
  {
    label: "24 Hours",
    value:
      "I completely understand your concern, and I apologize for the inconvenience. Unfortunately, our policy only allows us to address such requests within 24 hours of the issue. We truly value your understanding.",
    description:
      "I completely understand your concern, and I apologize for the inconvenience. Unfortunately, our policy only allows us to address such requests within 24 hours of the issue. We truly value your understanding.",
  },
  {
    label: "3 days",
    value:
      "We have reviewed your order, which was placed on <date>. As per our policy, refunds cannot be processed for orders older than 3 calendar days. We sincerely regret any inconvenience this may cause and appreciate your understanding.",
    description:
      "We have reviewed your order, which was placed on <date>. As per our policy, refunds cannot be processed for orders older than 3 calendar days. We sincerely regret any inconvenience this may cause and appreciate your understanding.",
  },
  {
    label: "48 Hours",
    value:
      "I completely understand your concern, and I apologize for the inconvenience. Unfortunately, our policy only allows us to address such requests within 48 hours of the issue. We truly value your understanding.",
    description:
      "I completely understand your concern, and I apologize for the inconvenience. Unfortunately, our policy only allows us to address such requests within 48 hours of the issue. We truly value your understanding.",
  },
  {
    label: "72 Hours",
    value:
      "I completely understand your concern, and I apologize for the inconvenience. Unfortunately, our policy only allows us to address such requests within 72 hours of the issue. We truly value your understanding.",
    description:
      "I completely understand your concern, and I apologize for the inconvenience. Unfortunately, our policy only allows us to address such requests within 72 hours of the issue. We truly value your understanding.",
  },
  {
    label: "20 Minutes",
    value:
      "I completely understand your concern, and I apologize for the inconvenience. Unfortunately, our policy only allows us to address such requests within 20 minutes of the issue. We truly value your understanding.",
    description:
      "I completely understand your concern, and I apologize for the inconvenience. Unfortunately, our policy only allows us to address such requests within 20 minutes of the issue. We truly value your understanding.",
  },
  {
    label: "Not online",
    value:
      "May we know if we are still connected to ensure we provide the best resolution?",
    description:
      "May we know if we are still connected to ensure we provide the best resolution?",
  },
  {
    label: "Left chat",
    value:
      "May we know if we are still connected to ensure we provide the best resolution?",
    description:
      "May we know if we are still connected to ensure we provide the best resolution?",
  },
  {
    label: "connected",
    value:
      "May we know if we are still connected to ensure we provide the best resolution?",
    description:
      "May we know if we are still connected to ensure we provide the best resolution?",
  },
  {
    label: "Call",
    value:
      "It looks like you left the chat before we could complete our conversation. I am calling you immediately on your registered mobile number to assist further and will make two attempts to connect.",
    description:
      "It looks like you left the chat before we could complete our conversation. I am calling you immediately on your registered mobile number to assist further and will make two attempts to connect.",
  },
  {
    label: "Unavailable",
    value:
      "It looks like you left the chat before we could complete our conversation. I am calling you immediately on your registered mobile number to assist further and will make two attempts to connect.",
    description:
      "It looks like you left the chat before we could complete our conversation. I am calling you immediately on your registered mobile number to assist further and will make two attempts to connect.",
  },
  {
    label: "Unresponsive",
    value:
      "Since you are unavailable at this moment, request you to come back at your convenience and one of my colleagues will assist you with the resolution. \n  Thank you for connecting with us today, we look forward to serving you again. Wishing you a good day.",
    description:
      "Since you are unavailable at this moment, request you to come back at your convenience and one of my colleagues will assist you with the resolution. \n  Thank you for connecting with us today, we look forward to serving you again. Wishing you a good day.",
  },
  {
    label: "Unavailable",
    value:
      "Since you are unavailable at this moment, request you to come back at your convenience and one of my colleagues will assist you with the resolution. \n  Thank you for connecting with us today, we look forward to serving you again. Wishing you a good day.",
    description:
      "Since you are unavailable at this moment, request you to come back at your convenience and one of my colleagues will assist you with the resolution. \n  Thank you for connecting with us today, we look forward to serving you again. Wishing you a good day.",
  },
  {
    label: "Incomplete chat",
    value:
      "Since you are unavailable at this moment, request you to come back at your convenience and one of my colleagues will assist you with the resolution. \n  Thank you for connecting with us today, we look forward to serving you again. Wishing you a good day.",
    description:
      "Since you are unavailable at this moment, request you to come back at your convenience and one of my colleagues will assist you with the resolution. \n  Thank you for connecting with us today, we look forward to serving you again. Wishing you a good day.",
  },
  {
    label: "colleagues",
    value:
      "Since you are unavailable at this moment, request you to come back at your convenience and one of my colleagues will assist you with the resolution. \n  Thank you for connecting with us today, we look forward to serving you again. Wishing you a good day.",
    description:
      "Since you are unavailable at this moment, request you to come back at your convenience and one of my colleagues will assist you with the resolution. \n  Thank you for connecting with us today, we look forward to serving you again. Wishing you a good day.",
  },
  {
    label: "Zepto Cash Refund",
    children: [
      {
        label: "Response 1",
        value:
          "I will process the refund for \u20b9_ to your Zepto Cash. It will reflect in the next couple of minutes, and you will be able to use it instantly for purchasing everything available on the Zepto App. Is that okay?",
        description:
          "I will process the refund for \u20b9_ to your Zepto Cash. It will reflect in the next couple of minutes, and you will be able to use it instantly for purchasing everything available on the Zepto App. Is that okay?",
      },
      {
        label: "Response 2",
        value:
          "We have initiated a refund of \u20b9 _____ to your Zepto Cash. It will reflect on your account in the next couple of minutes.",
        description:
          "We have initiated a refund of \u20b9 _____ to your Zepto Cash. It will reflect on your account in the next couple of minutes.",
      },
    ],
  },
  {
    label: "COD Refund",
    value:
      "Since your original mode of payment was COD, I can refund the amount to your Zepto Cash. May I go ahead and process the refund for \u20b9 ___ to your Zepto Cash?",
    description:
      "Since your original mode of payment was COD, I can refund the amount to your Zepto Cash. May I go ahead and process the refund for \u20b9 ___ to your Zepto Cash?",
  },
  {
    label: "Source Account Refund",
    value:
      "We have initiated a refund of \u20b9 _____ for you. Please allow 3 to 5 business days for the refund to reflect in your account. You will be able to track this refund on your Zepto App as well.",
    description:
      "We have initiated a refund of \u20b9 _____ for you. Please allow 3 to 5 business days for the refund to reflect in your account. You will be able to track this refund on your Zepto App as well.",
  },
  {
    label: "Zepto Cash/Benefits",
    value:
      "The Zepto Cash offers some fantastic benefits. Not only is it a secure and convenient way to receive funds, but it also opens a world of instant possibilities within the Zepto App. From seamless purchases to exclusive offers, the Zepto cash is designed to enhance your overall experience. Zepto Cash refund will reflect immediately, and you will be able to use it instantly for purchasing everything available on the Zepto. Should I process the refund to your Zepto Cash?",
    description:
      "The Zepto Cash offers some fantastic benefits. Not only is it a secure and convenient way to receive funds, but it also opens a world of instant possibilities within the Zepto App. From seamless purchases to exclusive offers, the Zepto cash is designed to enhance your overall experience. Zepto Cash refund will reflect immediately, and you will be able to use it instantly for purchasing everything available on the Zepto. Should I process the refund to your Zepto Cash?",
  },
  {
    label: "Further assistance",
    value: "Is there anything else I can assist you with today?",
    description: "Is there anything else I can assist you with today?",
  },
];

const CustomOption: React.FC<ZeptoTypeAhead> = ({
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
  currentLevel,
}: ZeptoTypeAheadHeaderProps) => (
  <div style={{ padding: "8px 16px", borderBottom: "1px solid #eee" }}>
    <h3 style={{ margin: 0 }}>Typeahead Menu</h3>
    <button onClick={onClose}>Close</button>
    <button onClick={onBack}>Back</button>
    <h3 style={{ margin: 0 }}>{currentLevel?.label}</h3>
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
