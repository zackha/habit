export const useHabitStore = () => {
  const supabase = useSupabaseClient<Habit>();
  const habits = useState<Habit[]>('habits', () => []);

  const fetchHabits = async (): Promise<void> => {
    try {
      const { data, error } = await supabase.from('habits').select('*').order('created_at', { ascending: true });

      if (error) throw error;

      habits.value = data || [];
    } catch (err) {
      console.error('Error fetching habits:', (err as Error).message);
    }
  };

  const createHabit = async (name: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('habits')
        .insert([{ name, days: {}, streak: 0 }])
        .select();

      if (error) throw error;

      if (data) habits.value = [...habits.value, ...data];
    } catch (err) {
      console.error('Error creating habit:', (err as Error).message);
    }
  };

  const toggleHabitDay = async (habitId: string, date: string): Promise<void> => {
    try {
      const habit = habits.value.find(h => h.id === habitId);
      if (!habit) return;

      const updatedDays = { ...habit.days, [date]: !habit.days[date] };
      const updatedStreak = Object.values(updatedDays).filter(Boolean).length;

      const { error } = await supabase.from('habits').update({ days: updatedDays, streak: updatedStreak }).eq('id', habitId);

      if (error) throw error;

      habit.days = updatedDays;
      habit.streak = updatedStreak;
    } catch (err) {
      console.error('Error toggling habit day:', (err as Error).message);
    }
  };

  const deleteHabit = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase.from('habits').delete().eq('id', id);
      if (error) throw error;

      habits.value = habits.value.filter(habit => habit.id !== id);
    } catch (err) {
      console.error('Error deleting habit:', (err as Error).message);
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
