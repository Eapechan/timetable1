import React from 'react';
import { Clock, User, BookOpen } from 'lucide-react';
import { Period } from '../types';
import { formatTime, isCurrentPeriod, getTimeProgress } from '../utils/timeUtils';

interface PeriodCardProps {
  period: Period;
  timeFormat: '12h' | '24h';
  isActive: boolean;
}

export function PeriodCard({ period, timeFormat, isActive }: PeriodCardProps) {
  const progress = getTimeProgress(period.startTime, period.endTime);
  const isCurrent = isCurrentPeriod(period.startTime, period.endTime);

  return (
    <div 
      className={`
        relative p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer
        ${isCurrent 
          ? 'bg-gradient-to-br from-indigo-500/20 to-purple-600/20 shadow-xl shadow-indigo-500/25 ring-2 ring-indigo-400/50' 
          : 'bg-white/80 dark:bg-gray-800/80 shadow-lg hover:shadow-xl'
        }
        backdrop-blur-sm border border-white/20 dark:border-gray-700/50
        ${period.type === 'break' ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-indigo-500'}
      `}
      id={`period-${period.id}`}
    >
      {isCurrent && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-ping"></div>
      )}
      
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          {period.type === 'class' ? (
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          ) : (
            <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          )}
          <h3 className="font-semibold text-gray-900 dark:text-white">{period.name}</h3>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {formatTime(period.startTime, timeFormat)} - {formatTime(period.endTime, timeFormat)}
        </div>
      </div>

      {period.teacher && (
        <div className="flex items-center space-x-2 mb-3">
          <User className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-300">{period.teacher}</span>
        </div>
      )}

      {isCurrent && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}