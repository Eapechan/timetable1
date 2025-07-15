import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { TimetableView } from './components/TimetableView';
import { SettingsPage } from './components/SettingsPage';
import { ThemeToggle } from './components/ThemeToggle';
import { useLocalStorage } from './hooks/useLocalStorage';
import { TimetableData, AppSettings } from './types';

const initialSchedule = [
  { day: 'Monday', periods: [] },
  { day: 'Tuesday', periods: [] },
  { day: 'Wednesday', periods: [] },
  { day: 'Thursday', periods: [] },
  { day: 'Friday', periods: [] },
  { day: 'Saturday', periods: [] },
  { day: 'Sunday', periods: [] }
];

const initialSettings: AppSettings = {
  timeFormat: '12h',
  theme: 'light',
  notifications: true
};

function App() {
  const [currentPage, setCurrentPage] = useState<'timetable' | 'settings'>('timetable');
  const [timetableData, setTimetableData] = useLocalStorage<TimetableData>('neostudy-timetable', {
    schedule: initialSchedule
  });
  const [settings, setSettings] = useLocalStorage<AppSettings>('neostudy-settings', initialSettings);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, [settings.theme]);

  const handleClearAllData = () => {
    setTimetableData({ schedule: initialSchedule });
    setSettings(initialSettings);
    setCurrentPage('timetable');
  };

  const handleToggleTheme = () => {
    setSettings({
      ...settings,
      theme: settings.theme === 'light' ? 'dark' : 'light'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 transition-all duration-300">
      <div className="max-w-md mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-white/20 dark:border-gray-700/50">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            NeoStudy Glow
          </h1>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle theme={settings.theme} onToggle={handleToggleTheme} />
            <button
              onClick={() => setCurrentPage(currentPage === 'timetable' ? 'settings' : 'timetable')}
              className="p-2 rounded-xl bg-white/10 dark:bg-black/10 backdrop-blur-sm border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          {currentPage === 'timetable' ? (
            <TimetableView
              schedule={timetableData.schedule}
              onUpdateSchedule={(schedule) => setTimetableData({ schedule })}
              timeFormat={settings.timeFormat}
            />
          ) : (
            <SettingsPage
              settings={settings}
              onUpdateSettings={setSettings}
              onBack={() => setCurrentPage('timetable')}
              onClearAllData={handleClearAllData}
              schedule={timetableData.schedule}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;