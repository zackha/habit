export interface Habit {
  id: number;
  title: string;
  description: string;
  complete_days: string[];
  target_days: number;
}

const today = new Date().toISOString().split('T')[0];

const habits = ref<Habit[]>([
  {
    id: 1,
    title: 'Morning Exercise',
    description: '**Daily** 30 minutes of exercise to stay fit.',
    complete_days: ['2025-01-11', '2025-01-10'],
    target_days: 40,
  },
  {
    id: 2,
    title: 'Reading',
    description: 'Read *at least* 20 pages every day.',
    complete_days: [
      '2025-01-11',
      '2025-01-10',
      '2025-01-09',
      '2025-01-08',
      '2025-01-07',
      '2025-01-06',
      '2025-01-05',
      '2025-01-04',
      '2025-01-03',
      '2025-01-02',
      '2025-01-01',
      '2024-12-31',
      '2024-12-30',
      '2024-12-29',
      '2024-12-28',
      '2024-12-27',
      '2024-12-26',
      '2024-12-25',
      '2024-12-24',
      '2024-12-23',
      '2024-12-22',
      '2024-12-21',
      '2024-12-20',
      '2024-12-19',
      '2024-12-18',
      '2024-12-17',
      '2024-12-16',
      '2024-12-15',
      '2024-12-14',
      '2024-12-13',
      '2024-12-12',
      '2024-12-11',
      '2024-12-10',
      '2024-12-09',
      '2024-12-08',
      '2024-12-07',
      '2024-12-06',
      '2024-12-05',
      '2024-12-04',
    ],
    target_days: 40,
  },
]);

const resetIfStreakBroken = (habit: Habit): void => {
  if (habit.complete_days.length === 0) return;

  const sortedDays = [...habit.complete_days].sort();
  const todayDate = new Date(today);

  const hasGap = sortedDays.some((day, index) => {
    if (index === 0) return false;
    const prevDate = new Date(sortedDays[index - 1]);
    const currentDate = new Date(day);
    return currentDate.getTime() - prevDate.getTime() > 24 * 60 * 60 * 1000;
  });

  const lastCompletedDate = new Date(sortedDays[sortedDays.length - 1]);
  const diffToToday = Math.ceil((todayDate.getTime() - lastCompletedDate.getTime()) / (1000 * 60 * 60 * 24));

  if (hasGap || diffToToday > 1) {
    habit.complete_days = [];
  }
};

const checkAllHabitsForStreak = (): void => {
  habits.value.forEach(resetIfStreakBroken);
};

const addHabit = (title: string, description: string): void => {
  if (title && description) {
    habits.value.push({
      id: Date.now(),
      title,
      description,
      complete_days: [],
      target_days: 40,
    });
  }
};

const deleteHabit = (id: number): void => {
  habits.value = habits.value.filter(habit => habit.id !== id);
};

const toggleTodayCompletion = (habit: Habit): void => {
  const todayIndex = habit.complete_days.indexOf(today);

  if (todayIndex === -1) {
    habit.complete_days.push(today);

    if (habit.complete_days.length === habit.target_days && habit.target_days === 40) {
      habit.target_days = 90;
    }
  } else {
    habit.complete_days.splice(todayIndex, 1);

    if (habit.target_days === 90 && habit.complete_days.length < 40) {
      habit.target_days = 40;
    }
  }
};

const isTodayCompleted = (habit: Habit): boolean => {
  return habit.complete_days.includes(today);
};

const getCompletionRate = (habit: Habit): number => {
  return Math.round((habit.complete_days.length / habit.target_days) * 100);
};

checkAllHabitsForStreak();

export function useHabits() {
  return {
    habits,
    today,
    addHabit,
    deleteHabit,
    toggleTodayCompletion,
    isTodayCompleted,
    getCompletionRate,
    checkAllHabitsForStreak,
  };
}
