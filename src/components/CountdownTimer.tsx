import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { getTimeRemaining } from '../utils/timeUtils';

interface CountdownTimerProps {
  endTime: string;
  periodName: string;
}

export function CountdownTimer({ endTime, periodName }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(endTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(endTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  if (timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-2xl shadow-lg backdrop-blur-sm border border-white/20 animate-pulse">
      <div className="flex items-center space-x-2">
        <Clock className="w-4 h-4" />
        <span className="text-sm font-medium">{periodName}</span>
        <span className="text-sm font-bold">
          {timeLeft.minutes}:{timeLeft.seconds.toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}