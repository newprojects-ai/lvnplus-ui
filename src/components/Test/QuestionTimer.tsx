import React, { useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useTimer } from '../../hooks/useTimer';

interface QuestionTimerProps {
  duration?: number;
  onTimeUp?: () => void;
  countUp?: boolean;
}

export function QuestionTimer({ duration, onTimeUp, countUp = false }: QuestionTimerProps) {
  const { time, elapsedTime, isRunning, start, formatTime } = useTimer({
    duration,
    onTimeUp,
    autoStart: true,
    countUp
  });

  const displayTime = countUp ? elapsedTime : time;
  const formattedTime = formatTime(displayTime).formatted;

  return (
    <div className="flex items-center space-x-2">
      <Clock className="h-5 w-5 text-gray-500" />
      <span className="font-medium text-gray-700">{formattedTime}</span>
    </div>
  );
}