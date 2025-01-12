<template>
  <div class="habit-tracker">
    <h1>Habit Tracker</h1>

    <div class="habits">
      <HabitCard v-for="habit in habits" :key="habit.id" :habit="habit" @delete="deleteHabit" @toggle-day="toggleDay" @update-tooltip="updateTooltip" />
    </div>

    <button @click="addHabit" class="create-button">Create Habit</button>
    <div ref="tooltip" class="tooltip"></div>
  </div>
</template>

<script lang="ts" setup>
const supabase = useSupabaseClient();

interface Day {
  date: string;
  active: boolean;
}

type Week = Day[];

interface Habit {
  id: number;
  name: string;
  weeks: Week[];
}

const habits = ref<Habit[]>([]);
const tooltip = ref<HTMLDivElement | null>(null);

const fetchHabits = async (): Promise<void> => {
  const { data, error } = await supabase.from('habits').select('*');
  if (error) {
    console.error('Error fetching habits:', error);
  } else if (data) {
    habits.value = data.map((habit: any) => ({
      id: habit.id,
      name: habit.name,
      weeks: habit.weeks,
    }));
  }
};

const saveHabit = async (habit: Habit): Promise<void> => {
  const { error } = await supabase.from('habits').insert([{ id: habit.id, name: habit.name, weeks: habit.weeks }]);
  if (error) {
    console.error('Error saving habit:', error);
  }
};

const deleteHabitFromDb = async (habitId: number): Promise<void> => {
  const { error } = await supabase.from('habits').delete().eq('id', habitId);
  if (error) {
    console.error('Error deleting habit:', error);
  }
};

const generateWeeks = (): Week[] => {
  const today = new Date();
  return Array.from({ length: 365 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (364 - i));
    return { date: date.toISOString().split('T')[0], active: false };
  }).reduce<Week[]>((weeks, day, index) => {
    if (index % 7 === 0) weeks.push([]);
    weeks[weeks.length - 1].push(day);
    return weeks;
  }, []);
};

const addHabit = async (): Promise<void> => {
  const habitName = prompt('Enter habit name:');
  if (habitName?.trim()) {
    const newHabit: Habit = {
      id: Date.now(),
      name: habitName.trim(),
      weeks: generateWeeks(),
    };
    habits.value.push(newHabit);
    await saveHabit(newHabit);
  }
};

const deleteHabit = async (habitId: number): Promise<void> => {
  habits.value = habits.value.filter(habit => habit.id !== habitId);
  await deleteHabitFromDb(habitId);
};

const toggleDay = async (habitId: number, weekIndex: number, dayIndex: number): Promise<void> => {
  const habit = habits.value.find(h => h.id === habitId);
  if (habit) {
    habit.weeks[weekIndex][dayIndex].active = !habit.weeks[weekIndex][dayIndex].active;
    await supabase.from('habits').update({ weeks: habit.weeks }).eq('id', habitId);
  }
};

const updateTooltip = (date: string, event: MouseEvent, visible: boolean): void => {
  if (tooltip.value) {
    tooltip.value.textContent = visible ? `Date: ${date}` : '';
    tooltip.value.style.top = `${event.clientY + 10}px`;
    tooltip.value.style.left = `${event.clientX + 10}px`;
    tooltip.value.style.visibility = visible ? 'visible' : 'hidden';
  }
};

onMounted(() => {
  fetchHabits();
});
</script>

<style scoped>
.habit-tracker {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
  margin-top: 20px;
}

.habits {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.create-button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  background-color: #4caf50;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.create-button:hover {
  background-color: #45a049;
}

.tooltip {
  position: fixed;
  background-color: black;
  color: white;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 12px;
  visibility: hidden;
  pointer-events: none;
  z-index: 1000;
}
</style>
