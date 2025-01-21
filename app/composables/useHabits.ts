import { isSameDay, parseISO, differenceInDays, format, compareAsc } from 'date-fns';

const habits = ref<Habit[]>([
  {
    id: 1,
    title: 'Morning Exercise',
    description: '**Daily** 30 minutes of exercise to stay fit.',
    complete_days: ['2025-01-12'],
    target_days: 40,
  },
  {
    id: 2,
    title: 'Reading',
    description: 'Read *at least* 20 pages every day.',
    complete_days: ['2025-01-15', '2025-01-14', '2025-01-13', '2025-01-12'],
    target_days: 40,
  },
]);

const today = format(new Date(), 'yyyy-MM-dd');

const resetIfStreakBroken = (habit: Habit): void => {
  if (habit.complete_days.length === 0) return;

  const sortedDays = habit.complete_days.slice().sort((a, b) => compareAsc(parseISO(a), parseISO(b)));
  const hasGap = sortedDays.some((day, index) => index > 0 && differenceInDays(parseISO(day), parseISO(sortedDays[index - 1])) > 1);

  const lastCompletedDate = parseISO(sortedDays[sortedDays.length - 1]);
  const diffToToday = differenceInDays(parseISO(today), lastCompletedDate);

  if (hasGap || diffToToday > 1) habit.complete_days = [];
};

const checkAllHabitsForStreak = (): void => habits.value.forEach(resetIfStreakBroken);

const addHabit = (title: string, description: string): void => {
  if (!title.trim() || !description.trim()) return;

  habits.value.push({
    id: Date.now(),
    title,
    description,
    complete_days: [],
    target_days: 40,
  });
};

const deleteHabit = (id: number): void => {
  habits.value = habits.value.filter(habit => habit.id !== id);
};

const toggleTodayCompletion = (habit: Habit): void => {
  const isCompletedToday = habit.complete_days.some(day => isSameDay(parseISO(day), parseISO(today)));

  if (isCompletedToday) {
    habit.complete_days = habit.complete_days.filter(day => !isSameDay(parseISO(day), parseISO(today)));
    if (habit.target_days === 90 && habit.complete_days.length < 40) {
      habit.target_days = 40;
    }
  } else {
    habit.complete_days.push(today);
    if (habit.complete_days.length === habit.target_days && habit.target_days === 40) {
      habit.target_days = 90;
    }
  }
};

const isTodayCompleted = (habit: Habit): boolean => habit.complete_days.some(day => isSameDay(parseISO(day), parseISO(today)));

const getCompletionRate = (habit: Habit): number => Math.round((habit.complete_days.length / habit.target_days) * 100);

checkAllHabitsForStreak();

export function useHabits() {
  return {
    habits,
    addHabit,
    deleteHabit,
    toggleTodayCompletion,
    isTodayCompleted,
    getCompletionRate,
  };
}
