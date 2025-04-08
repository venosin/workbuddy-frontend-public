import { useState, useEffect } from "react";

export function Toggle({ enabled, onChange, disabled = false }) {
  const [isEnabled, setIsEnabled] = useState(enabled);

  useEffect(() => {
    setIsEnabled(enabled);
  }, [enabled]);

  const handleToggle = () => {
    if (!disabled) {
      setIsEnabled(!isEnabled);
      if (onChange) {
        onChange();
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={disabled}
      className={`${
        isEnabled ? "bg-green-600" : "bg-brown-200"
      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <span className="sr-only">Toggle</span>
      <span
        className={`${
          isEnabled ? "translate-x-6" : "translate-x-1"
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
      />
    </button>
  );
}
