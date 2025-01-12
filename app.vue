<template>
  <div class="calendar">
    <div class="habits">
      <div v-for="habit in habits" :key="habit.id" class="habit">
        <h3>{{ habit.title }}</h3>
        <p>{{ habit.description }}</p>
        <div class="heatmap">
          <div v-for="(week, weekIndex) in generateWeeks(habit)" :key="weekIndex" class="week">
            <div
              v-for="(day, dayIndex) in week"
              :key="dayIndex"
              :class="['day', { active: isDayCompleted(habit, day.date) }]"
              @click="toggleDay(habit, day.date)"
              @mouseenter="showTooltip(habit.title, day.date, $event)"
              @mouseleave="hideTooltip"></div>
          </div>
        </div>
      </div>
    </div>
    <div ref="tooltip" class="tooltip"></div>
    <div class="new-habit-form">
      <h3>Add New Habit</h3>
      <input v-model="newHabit.title" placeholder="Title" />
      <textarea v-model="newHabit.description" placeholder="Description"></textarea>
      <button @click="addHabit">Add Habit</button>
    </div>
  </div>
</template>
<script lang="ts" setup>
interface Habit {
  id: number;
  title: string;
  description: string;
  completeDays: string[];
}

interface Day {
  date: string;
}

type Week = Day[];

const habits = ref<Habit[]>([
  {
    id: 1,
    title: 'Morning Exercise',
    description: 'Daily 30 minutes of exercise to stay fit.',
    completeDays: ['2025-01-01', '2025-01-03', '2025-01-05'],
  },
  {
    id: 2,
    title: 'Reading',
    description: 'Read at least 20 pages every day.',
    completeDays: ['2025-01-02', '2025-01-04', '2025-01-06'],
  },
]);

const newHabit = ref<Habit>({
  id: Date.now(),
  title: '',
  description: '',
  completeDays: [],
});

const generateWeeks = (habit: Habit): Week[] => {
  const days: Day[] = Array.from({ length: 365 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (364 - i));
    return { date: date.toISOString().split('T')[0] };
  });

  return days.reduce<Week[]>((weeks, day, index) => {
    if (index % 7 === 0) weeks.push([]);
    weeks[weeks.length - 1].push(day);
    return weeks;
  }, []);
};

const toggleDay = (habit: Habit, date: string): void => {
  const index = habit.completeDays.indexOf(date);
  if (index === -1) {
    habit.completeDays.push(date);
  } else {
    habit.completeDays.splice(index, 1);
  }
};

const isDayCompleted = (habit: Habit, date: string): boolean => {
  return habit.completeDays.includes(date);
};

const tooltip = ref<HTMLDivElement | null>(null);

const showTooltip = (title: string, date: string, event: MouseEvent): void => {
  if (tooltip.value) {
    tooltip.value.textContent = `${title} - ${date}`;
    tooltip.value.style.top = `${event.clientY + 10}px`;
    tooltip.value.style.left = `${event.clientX + 10}px`;
    tooltip.value.style.visibility = 'visible';
  }
};

const hideTooltip = (): void => {
  if (tooltip.value) tooltip.value.style.visibility = 'hidden';
};

const addHabit = (): void => {
  if (newHabit.value.title && newHabit.value.description) {
    habits.value.push({
      ...newHabit.value,
      id: Date.now(),
      completeDays: [],
    });
    newHabit.value = { id: Date.now(), title: '', description: '', completeDays: [] };
  }
};
</script>
<style scoped>
.calendar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  font-family: Arial, sans-serif;
}

.habits {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.habit {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.heatmap {
  display: flex;
  flex-direction: row;
  gap: 4px;
}

.week {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.day {
  width: 12px;
  height: 12px;
  background-color: #e0e0e0;
  border-radius: 2px;
  transition: background-color 0.3s ease-in-out;
  cursor: pointer;
}

.day.active {
  background-color: #4caf50;
}

.day:hover {
  opacity: 0.8;
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

.new-habit-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 300px;
}

.new-habit-form input,
.new-habit-form textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.new-habit-form button {
  padding: 8px 12px;
  border: none;
  background-color: #4caf50;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.new-habit-form button:hover {
  background-color: #45a049;
}
</style>
