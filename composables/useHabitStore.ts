export const useHabitStore = () => {
  const supabase = useSupabaseClient();
  const habits = useState('habits', () => []);

  const fetchHabits = async () => {
    const { data, error } = await supabase.from('habits').select('*').order('created_at', { ascending: true });

    if (error) {
      console.error(error.message);
    } else {
      habits.value = data || [];
    }
  };

  const createHabit = async (name: string) => {
    const { data, error } = await supabase
      .from('habits')
      .insert([{ name, days: {}, streak: 0 }])
      .select();

    if (error) {
      console.error(error.message);
    } else {
      habits.value.push(data[0]);
    }
  };

  const toggleHabitDay = async (habitId: string, date: string) => {
    const habit = habits.value.find(h => h.id === habitId);
    if (!habit) return;

    const days = { ...habit.days, [date]: !habit.days[date] };
    const streak = Object.values(days).filter(Boolean).length;

    const { error } = await supabase.from('habits').update({ days, streak }).eq('id', habitId);

    if (error) {
      console.error(error.message);
    } else {
      habit.days = days;
      habit.streak = streak;
    }
  };

  return { habits, fetchHabits, createHabit, toggleHabitDay };
};
