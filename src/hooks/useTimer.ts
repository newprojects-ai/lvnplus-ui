import { useState, useEffect, useCallback } from 'react';

interface UseTimerProps {
  duration?: number; // in seconds
  onTimeUp?: () => void;
  autoStart?: boolean;
  countUp?: boolean;
}

export function useTimer({ 
  duration, 
  onTimeUp, 
  autoStart = false,
  countUp = false
}: UseTimerProps = {}) {
  const [time, setTime] = useState(duration || 0);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        if (countUp) {
          setElapsedTime(prev => prev + 1);
        } else if (duration) {
          setTime(prev => {
            if (prev <= 1) {
              setIsRunning(false);
              onTimeUp?.();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, duration, countUp, onTimeUp]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setTime(duration || 0);
    setElapsedTime(0);
    setIsRunning(false);
  }, [duration]);

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return {
      hours,
      minutes,
      seconds: remainingSeconds,
      formatted: `${hours > 0 ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    };
  }, []);

  return {
    time,
    elapsedTime,
    isRunning,
    start,
    pause,
    reset,
    formatTime
  };
}