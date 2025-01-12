export interface Habit {
  id: number;
  title: string;
  description: string;
  completeDays: string[];
}

const today = new Date().toISOString().split('T')[0];

const habits = ref<Habit[]>([
  {
    id: 1,
    title: 'Morning Exercise',
    description: '**Daily** 30 minutes of exercise to stay fit.',
    completeDays: ['2025-01-01', '2025-01-03', '2025-01-05'],
  },
  {
    id: 2,
    title: 'Reading',
    description: 'Read *at least* 20 pages every day.',
    completeDays: ['2025-01-02', '2025-01-04', '2025-01-06'],
  },
]);

export function useHabits() {
  const addHabit = (title: string, description: string): void => {
    if (title && description) {
      habits.value.push({
        id: Date.now(),
        title,
        description,
        completeDays: [],
      });
    }
  };

  const deleteHabit = (id: number): void => {
    habits.value = habits.value.filter(habit => habit.id !== id);
  };

  const toggleTodayCompletion = (habit: Habit): void => {
    if (habit.completeDays.includes(today)) {
      habit.completeDays = habit.completeDays.filter(day => day !== today);
    } else {
      habit.completeDays.push(today);
    }
  };

  const isTodayCompleted = (habit: Habit): boolean => {
    return habit.completeDays.includes(today);
  };

  const getCompletionRate = (habit: Habit): number => {
    return Math.round((habit.completeDays.length / 365) * 100);
  };

  return {
    habits,
    today,
    addHabit,
    deleteHabit,
    toggleTodayCompletion,
    isTodayCompleted,
    getCompletionRate,
  };
}
