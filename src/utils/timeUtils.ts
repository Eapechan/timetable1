export function getCurrentDay(): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
}

export function getCurrentTime(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

export function formatTime(time: string, format: '12h' | '24h'): string {
  const [hours, minutes] = time.split(':').map(Number);
  
  if (format === '12h') {
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function isCurrentPeriod(startTime: string, endTime: string): boolean {
  const now = getCurrentTime();
  return now >= startTime && now <= endTime;
}

export function getTimeProgress(startTime: string, endTime: string): number {
  const now = getCurrentTime();
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  const [nowHours, nowMinutes] = now.split(':').map(Number);
  
  const startTotal = startHours * 60 + startMinutes;
  const endTotal = endHours * 60 + endMinutes;
  const nowTotal = nowHours * 60 + nowMinutes;
  
  if (nowTotal < startTotal) return 0;
  if (nowTotal > endTotal) return 100;
  
  return ((nowTotal - startTotal) / (endTotal - startTotal)) * 100;
}

export function getTimeRemaining(endTime: string): { minutes: number; seconds: number } {
  const now = new Date();
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHours, endMinutes);
  
  const diff = endDate.getTime() - now.getTime();
  
  if (diff <= 0) return { minutes: 0, seconds: 0 };
  
  const totalSeconds = Math.floor(diff / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return { minutes, seconds };
}