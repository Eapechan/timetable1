import React from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Download, 
  Upload, 
  Trash2, 
  FileText,
  Settings as SettingsIcon,
  Moon,
  Sun
} from 'lucide-react';
import { AppSettings, DaySchedule } from '../types';

interface SettingsPageProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onBack: () => void;
  onClearAllData: () => void;
  schedule: DaySchedule[];
}

export function SettingsPage({ 
  settings, 
  onUpdateSettings, 
  onBack, 
  onClearAllData,
  schedule 
}: SettingsPageProps) {
  
  const handleExportData = () => {
    const dataStr = JSON.stringify({ schedule, settings }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'neostudy-timetable.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.schedule && data.settings) {
            // Here you would typically call a callback to update the main app state
            console.log('Import data:', data);
            alert('Data imported successfully! (This is a demo - full implementation would update the app state)');
          }
        } catch (error) {
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        </div>
      </div>

      <div className="space-y-6 p-4">
        {/* Appearance Settings */}
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 backdrop-blur-sm border border-white/20 dark:border-gray-700/50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <SettingsIcon className="w-5 h-5 mr-2" />
            Appearance
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {settings.theme === 'light' ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-400" />
                )}
                <span className="text-gray-700 dark:text-gray-300">Theme</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ 
                  ...settings, 
                  theme: settings.theme === 'light' ? 'dark' : 'light' 
                })}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium transition-colors"
              >
                {settings.theme === 'light' ? 'Dark' : 'Light'} Mode
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-indigo-500" />
                <span className="text-gray-700 dark:text-gray-300">Time Format</span>
              </div>
              <select
                value={settings.timeFormat}
                onChange={(e) => onUpdateSettings({ 
                  ...settings, 
                  timeFormat: e.target.value as '12h' | '24h' 
                })}
                className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="12h">12 Hour</option>
                <option value="24h">24 Hour</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 backdrop-blur-sm border border-white/20 dark:border-gray-700/50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Data Management
          </h2>
          
          <div className="space-y-4">
            <button
              onClick={handleExportData}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Export Timetable</span>
            </button>

            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors">
                <Upload className="w-5 h-5" />
                <span>Import Timetable</span>
              </button>
            </div>

            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                  onClearAllData();
                }
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span>Clear All Data</span>
            </button>
          </div>
        </div>

        {/* About */}
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 backdrop-blur-sm border border-white/20 dark:border-gray-700/50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            About NeoStudy Glow
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            A modern, offline-first timetable manager designed for students and professionals. 
            Built with React, TypeScript, and Tailwind CSS for a seamless experience across all devices.
          </p>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-500">
            Version 1.0.0 • Built with ❤️ for productivity
          </div>
        </div>
      </div>
    </div>
  );
}