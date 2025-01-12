export const useHabitStore = () => {
  const supabase = useSupabaseClient<Habit>();
  const habits = useState<Habit[]>('habits', () => []);

  const fetchHabits = async (): Promise<void> => {
    const { data, error } = await supabase.from('habits').select('*').order('created_at', { ascending: true });

    if (error) {
      console.error(error.message);
    } else {
      habits.value = data || [];
    }
  };

  const createHabit = async (name: string): Promise<void> => {
    const { data, error } = await supabase
      .from('habits')
      .insert([{ name, days: {}, streak: 0 }])
      .select();

    if (error) {
      console.error(error.message);
    } else if (data) {
      habits.value.push(data[0]);
    }
  };

  const toggleHabitDay = async (habitId: string, date: string): Promise<void> => {
    const habit = habits.value.find(h => h.id === habitId);
    if (!habit) return;

    const updatedDays = { ...habit.days, [date]: !habit.days[date] };
    const updatedStreak = Object.values(updatedDays).filter(Boolean).length;

    const { error } = await supabase.from('habits').update({ days: updatedDays, streak: updatedStreak }).eq('id', habitId);

    if (error) {
      console.error(error.message);
    } else {
      habit.days = updatedDays;
      habit.streak = updatedStreak;
    }
  };

  const deleteHabit = async (id: string): Promise<void> => {
    const { error } = await supabase.from('habits').delete().eq('id', id);

    if (error) {
      console.error(error.message);
    } else {
      habits.value = habits.value.filter(habit => habit.id !== id);
    }
  };

  return {
    habits,
    fetchHabits,
    createHabit,
    toggleHabitDay,
    deleteHabit,
  };
};
