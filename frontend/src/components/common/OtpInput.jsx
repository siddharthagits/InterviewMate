import { useRef, useEffect } from "react";

export default function OtpInput({
  value = "",
  onChange,
  length = 4,
  disabled = false,
  hasError = false,
  autoFocus = true,
}) {
  const inputsRef = useRef([]);

  // Ensure value is length-padded array of chars
  const digits = Array.from({ length }, (_, i) => value[i] || "");

  useEffect(() => {
    if (autoFocus && inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (e, index) => {
    const rawVal = e.target.value;
    const digit = rawVal.replace(/\D/g, "").slice(-1); // Only keep last typed digit

    const newDigits = [...digits];
    newDigits[index] = digit;
    const nextValue = newDigits.join("");
    onChange(nextValue);

    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        onChange(newDigits.join(""));
      } else {
        const newDigits = [...digits];
        newDigits[index] = "";
        onChange(newDigits.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;

    onChange(pasted);
    const targetIdx = Math.min(pasted.length, length - 1);
    inputsRef.current[targetIdx]?.focus();
  };

  return (
    <div className="otp-input-group" onPaste={handlePaste}>
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => (inputsRef.current[idx] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          autoComplete={idx === 0 ? "one-time-code" : "off"}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          className={`otp-box ${digit ? "filled" : ""} ${hasError ? "error" : ""}`}
          aria-label={`Digit ${idx + 1}`}
        />
      ))}

      <style>{`
        .otp-input-group {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 16px 0;
        }
        .otp-box {
          width: 54px;
          height: 60px;
          text-align: center;
          font-size: 26px;
          font-weight: 800;
          font-family: 'Sora', 'Inter', monospace, sans-serif;
          color: var(--text, #fff);
          background: var(--glass, rgba(255,255,255,0.04));
          border: 1.5px solid var(--glass-border, rgba(255,255,255,0.12));
          border-radius: 14px;
          outline: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 14px rgba(0,0,0,0.06);
        }
        .otp-box:focus {
          border-color: var(--violet, #7c3aed);
          background: var(--violet-subtle, rgba(124,58,237,0.08));
          box-shadow: 0 0 0 4px rgba(124,58,237,0.18), 0 4px 20px rgba(124,58,237,0.25);
          transform: translateY(-2px);
        }
        .otp-box.filled {
          border-color: rgba(124,58,237,0.5);
          background: rgba(124,58,237,0.04);
        }
        .otp-box.error {
          border-color: #ef4444 !important;
          background: rgba(239,68,68,0.05);
          box-shadow: 0 0 0 3px rgba(239,68,68,0.15);
        }
        .otp-box:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        @media (max-width: 480px) {
          .otp-box {
            width: 46px;
            height: 52px;
            font-size: 22px;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}
