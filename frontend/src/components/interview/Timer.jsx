import { useEffect, useState } from "react";

// Parse "10 Minutes" → 600 seconds
function parseDurationSeconds(duration) {
  if (!duration) return 600;
  const match = duration.match(/(\d+)/);
  if (!match) return 600;
  return parseInt(match[1], 10) * 60;
}

function Timer({ duration, onTimeUp }) {
  const totalSeconds = parseDurationSeconds(duration);
  const [time, setTime] = useState(totalSeconds);

  useEffect(() => {
    if (time <= 0) {
      onTimeUp?.();
      return;
    }

    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []); // run once on mount

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const isWarning = time <= 60;
  const isCritical = time <= 10;

  return (
    <div
      className={`px-4 py-2 rounded-lg font-bold text-lg tabular-nums transition-colors ${
        isCritical
          ? "bg-red-600 text-white animate-pulse"
          : isWarning
          ? "bg-orange-100 text-orange-600"
          : "bg-red-100 text-red-600"
      }`}
    >
      ⏱ {minutes}:{seconds.toString().padStart(2, "0")}
    </div>
  );
}

export default Timer;