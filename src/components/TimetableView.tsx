import React, { useState, useEffect, useRef } from 'react';
import { PeriodCard } from './PeriodCard';
import { CountdownTimer } from './CountdownTimer';
import { Modal } from './Modal';
import { FloatingActionButton } from './FloatingActionButton';
import { Period, DaySchedule } from '../types';
import { getCurrentDay, isCurrentPeriod } from '../utils/timeUtils';

interface TimetableViewProps {
  schedule: DaySchedule[];
  onUpdateSchedule: (schedule: DaySchedule[]) => void;
  timeFormat: '12h' | '24h';
}

export function TimetableView({ schedule, onUpdateSchedule, timeFormat }: TimetableViewProps) {
  const [activeDay, setActiveDay] = useState(getCurrentDay());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<Period | undefined>();
  const [currentPeriod, setCurrentPeriod] = useState<Period | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    const findCurrentPeriod = () => {
      const todaySchedule = schedule.find(s => s.day === getCurrentDay());
      if (todaySchedule) {
        const current = todaySchedule.periods.find(p => isCurrentPeriod(p.startTime, p.endTime));
        setCurrentPeriod(current || null);
      }
    };

    findCurrentPeriod();
    const interval = setInterval(findCurrentPeriod, 60000);
    return () => clearInterval(interval);
  }, [schedule]);

  useEffect(() => {
    if (currentPeriod && activeDay === getCurrentDay()) {
      const periodElement = document.getElementById(`period-${currentPeriod.id}`);
      if (periodElement) {
        periodElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentPeriod, activeDay]);

  const currentDaySchedule = schedule.find(s => s.day === activeDay) || { day: activeDay, periods: [] };

  const handleSavePeriod = (period: Period) => {
    const updatedSchedule = schedule.map(daySchedule => {
      if (daySchedule.day === activeDay) {
        const existingIndex = daySchedule.periods.findIndex(p => p.id === period.id);
        if (existingIndex >= 0) {
          const updatedPeriods = [...daySchedule.periods];
          updatedPeriods[existingIndex] = period;
          return { ...daySchedule, periods: updatedPeriods };
        } else {
          return { ...daySchedule, periods: [...daySchedule.periods, period].sort((a, b) => a.startTime.localeCompare(b.startTime)) };
        }
      }
      return daySchedule;
    });

    onUpdateSchedule(updatedSchedule);
    setEditingPeriod(undefined);
  };

  const handleDeletePeriod = (id: string) => {
    const updatedSchedule = schedule.map(daySchedule => {
      if (daySchedule.day === activeDay) {
        return { ...daySchedule, periods: daySchedule.periods.filter(p => p.id !== id) };
      }
      return daySchedule;
    });

    onUpdateSchedule(updatedSchedule);
    setEditingPeriod(undefined);
  };

  const handlePeriodClick = (period: Period) => {
    setEditingPeriod(period);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      {currentPeriod && activeDay === getCurrentDay() && (
        <CountdownTimer endTime={currentPeriod.endTime} periodName={currentPeriod.name} />
      )}

      {/* Day Navigation */}
      <div className="flex overflow-x-auto pb-4 mb-6 scrollbar-hide">
        <div className="flex space-x-2 mx-auto">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`
                px-4 py-2 rounded-xl font-medium transition-all duration-300 whitespace-nowrap
                ${activeDay === day
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 shadow-md'
                }
                backdrop-blur-sm border border-white/20 dark:border-gray-700/50
              `}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Timetable Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pb-20">
        {currentDaySchedule.periods.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              No periods scheduled for {activeDay}
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-medium transition-colors"
            >
              Add First Period
            </button>
          </div>
        ) : (
          currentDaySchedule.periods.map(period => (
            <div key={period.id} onClick={() => handlePeriodClick(period)}>
              <PeriodCard
                period={period}
                timeFormat={timeFormat}
                isActive={activeDay === getCurrentDay()}
              />
            </div>
          ))
        )}
      </div>

      <FloatingActionButton onClick={() => setIsModalOpen(true)} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPeriod(undefined);
        }}
        onSave={handleSavePeriod}
        onDelete={editingPeriod ? handleDeletePeriod : undefined}
        period={editingPeriod}
        day={activeDay}
      />
    </div>
  );
}