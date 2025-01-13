import { isSameDay, parseISO, differenceInDays, format, compareAsc } from 'date-fns';

export interface Habit {
  id: number;
  title: string;
  description: string;
  complete_days: string[];
  target_days: number;
}

const today = format(new Date(), 'yyyy-MM-dd');
const habits = ref<Habit[]>([]);

export const useHabits = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const resetIfStreakBroken = (habit: Habit): void => {
    if (habit.complete_days.length === 0) return;

    const sortedDays = [...habit.complete_days].sort((a, b) => compareAsc(parseISO(a), parseISO(b)));

    const hasGap = sortedDays.some((day, index) => {
      if (index === 0) return false;
      return differenceInDays(parseISO(day), parseISO(sortedDays[index - 1])) > 1;
    });

    const lastCompletedDate = parseISO(sortedDays[sortedDays.length - 1]);
    const diffToToday = differenceInDays(parseISO(today), lastCompletedDate);

    if (hasGap || diffToToday > 1) {
      habit.complete_days = [];
    }
  };

  const checkAllHabitsForStreak = (): void => {
    habits.value.forEach(resetIfStreakBroken);
  };

  const loadHabits = async () => {
    if (!user.value) return;

    const { data, error } = await supabase.from('habits').select('*').eq('user_id', user.value.id);

    if (error) {
      console.error('Habits could not be loaded:', error.message);
      return;
    }

    habits.value = data || [];
    checkAllHabitsForStreak();
  };

  const addHabit = (title: string, description: string): void => {
    if (!title || !description) return;

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
    const todayIndex = habit.complete_days.findIndex(day => isSameDay(parseISO(day), parseISO(today)));

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
    return habit.complete_days.some(day => isSameDay(parseISO(day), parseISO(today)));
  };

  const getCompletionRate = (habit: Habit): number => {
    return Math.round((habit.complete_days.length / habit.target_days) * 100);
  };

  return {
    habits,
    today,
    addHabit,
    deleteHabit,
    toggleTodayCompletion,
    isTodayCompleted,
    getCompletionRate,
    loadHabits,
  };
};
