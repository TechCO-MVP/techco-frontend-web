import React, { useEffect, useState } from "react";

interface TimerProps {
  duration: number;
  onExpire?: () => void;
}

/**
 * A Timer component that counts down from a given duration
 *  and triggers a callback when the timer expires.
 */
export const Timer: React.FC<Readonly<TimerProps>> = ({
  duration,
  onExpire,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire?.();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onExpire]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return <span>{formatTime(timeLeft)}</span>;
};
