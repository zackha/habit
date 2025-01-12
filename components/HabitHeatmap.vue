<template>
  <div class="heatmap">
    <div v-for="(week, weekIndex) in generateWeeks(habit)" :key="weekIndex" class="week">
      <div v-for="(day, dayIndex) in week" :key="dayIndex" :class="['day', { active: habit.completeDays.includes(day.date) }]"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Day {
  date: string;
}

type Week = Day[];

defineProps<{ habit: Habit }>();

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
</script>

<style scoped>
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
}

.day.active {
  background-color: #4caf50;
}
</style>
