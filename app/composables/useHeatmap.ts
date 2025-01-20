import { format, subDays, isThisYear } from 'date-fns';

export const generateWeeks = (daysCount = 49): Week[] => {
  const days: Day[] = Array.from({ length: daysCount }, (_, i) => {
    const date = subDays(new Date(), daysCount - 1 - i);
    return { date: format(date, 'yyyy-MM-dd') };
  });

  const weeks: Week[] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return weeks;
};

export const formatDate = (date: string): string => {
  return isThisYear(new Date(date)) ? format(new Date(date), 'MMMM d') : format(new Date(date), 'MMMM d, yyyy');
};
